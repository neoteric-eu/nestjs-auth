import {ParseIntPipe, UseGuards} from '@nestjs/common';
import {Args, Mutation, Query, Resolver, Subscription} from '@nestjs/graphql';
import {PubSub} from 'graphql-subscriptions';
import {HomeFavoriteService} from './home-favorite.service';
import {HomeFavorite} from '../graphql.schema';
import {CreateHomeFavoriteDto, DeleteHomeFavoriteDto} from './dto';

const pubSub = new PubSub();

@Resolver('HomeFavorite')
export class HomeFavoriteResolvers {
	constructor(private readonly homeFavoriteService: HomeFavoriteService) {
	}

	@Query('getHomeFavorite')
	async findOneById(@Args('id') id: string): Promise<HomeFavorite> {
		return await this.homeFavoriteService.findOneById(id);
	}

	@Mutation('createHomeFavorite')
	async create(@Args('createHomeFavoriteInput') args: CreateHomeFavoriteDto): Promise<HomeFavorite> {
		const createdHomeFavorite = await this.homeFavoriteService.create(args);
		pubSub.publish('homeFavoriteCreated', {homeCreatedFavorite: createdHomeFavorite});
		return createdHomeFavorite;
	}

	@Mutation('deleteHomeFavorite')
	async delete(@Args('deleteHomeFavoriteInput') args: DeleteHomeFavoriteDto): Promise<HomeFavorite> {
		const deletedHomeFavorite = await this.homeFavoriteService.delete(args.id);
		pubSub.publish('homeFavoriteDeleted', {homeFavoriteDeleted: deletedHomeFavorite});
		return deletedHomeFavorite;
	}

	@Subscription('homeFavoriteCreated')
	homeFavoriteCreated() {
		return {
			subscribe: () => pubSub.asyncIterator('homeFavoriteCreated')
		};
	}
}
