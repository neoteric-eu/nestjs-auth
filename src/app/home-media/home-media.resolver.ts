import {UseGuards} from '@nestjs/common';
import {Args, Mutation, Query, Resolver, Subscription} from '@nestjs/graphql';
import {PubSub} from 'graphql-subscriptions';
import {HomeMediaService} from './home-media.service';
import {CreateHomeMediaInput, DeleteHomeMediaInput, HomeMedia} from '../graphql.schema';
import {GraphqlGuard} from '../_helpers';
import {User as CurrentUser} from '../_helpers/graphql/user.decorator';
import {UserEntity as User} from '../user/entity';

const pubSub = new PubSub();

@Resolver('HomeMedia')
@UseGuards(GraphqlGuard)
export class HomeMediaResolver {
	constructor(private readonly homeMediaService: HomeMediaService) {
	}

	@Query('getHomeMedia')
	async findAll(@Args('homeId') homeId: string): Promise<HomeMedia[]> {
		return this.homeMediaService.findAll({filter: {homeId: {eq: homeId}}});
	}

	@Mutation('createHomeMedia')
	async create(@CurrentUser() user: User, @Args('createHomeMediaInput') args: CreateHomeMediaInput): Promise<HomeMedia> {
		const createdHomeMedia = await this.homeMediaService.create(args);
		pubSub.publish('homeMediaCreated', {homeMediaCreated: createdHomeMedia});
		return createdHomeMedia;
	}

	@Mutation('deleteHomeMedia')
	async delete(@CurrentUser() user: User, @Args('deleteHomeMediaInput') args: DeleteHomeMediaInput): Promise<HomeMedia> {
		const deletedHomeMedia = await this.homeMediaService.delete(args.id);
		pubSub.publish('homeMediaDeleted', {homeMediaDeleted: deletedHomeMedia});
		return deletedHomeMedia;
	}

	@Subscription('homeMediaCreated')
	homeMediaCreated() {
		return {
			subscribe: () => pubSub.asyncIterator('homeMediaCreated')
		};
	}

	@Subscription('homeMediaDeleted')
	homeMediaDeleted() {
		return {
			subscribe: () => pubSub.asyncIterator('homeMediaDeleted')
		};
	}
}
