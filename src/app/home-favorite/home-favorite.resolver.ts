import {equals} from '@aws/dynamodb-expressions';
import {UnauthorizedException, UseGuards} from '@nestjs/common';
import {Args, Mutation, Query, Resolver, Subscription} from '@nestjs/graphql';
import {PubSub} from 'graphql-subscriptions';
import {HomeFavoriteService} from './home-favorite.service';
import {HomeFavorite} from '../graphql.schema';
import {CreateHomeFavoriteDto, DeleteHomeFavoriteDto} from './dto';
import {GraphqlGuard} from '../_helpers';
import {User as CurrentUser} from '../_helpers/graphql/user.decorator';
import {UserEntity as User} from '../user/entity';
import {HomeFavoriteEntity} from './entity';

const pubSub = new PubSub();

@Resolver('HomeFavorite')
@UseGuards(GraphqlGuard)
export class HomeFavoriteResolver {
	constructor(private readonly homeFavoriteService: HomeFavoriteService) {
	}

	@Query('getHomeFavorites')
	async findAll(@CurrentUser() user: User): Promise<HomeFavorite[]> {
		return this.homeFavoriteService.findAll({filter: {...equals(user.id), subject: 'homeFavoriteUserId'}});
	}

	@Query('getHomeFavorite')
	async findOneById(@Args('id') id: string): Promise<HomeFavorite> {
		return this.homeFavoriteService.findOneById(id);
	}

	@Mutation('createHomeFavorite')
	async create(@CurrentUser() user: User, @Args('createHomeFavoriteInput') args: CreateHomeFavoriteDto): Promise<HomeFavorite> {
		args.homeFavoriteUserId = user.id;
		const createdHomeFavorite = await this.homeFavoriteService.create(args);
		pubSub.publish('homeFavoriteCreated', {homeCreatedFavorite: createdHomeFavorite});
		return createdHomeFavorite;
	}

	@Mutation('deleteHomeFavorite')
	async delete(@CurrentUser() user: User, @Args('deleteHomeFavoriteInput') args: DeleteHomeFavoriteDto): Promise<HomeFavorite> {
		const homeFavoritesToDelete: HomeFavoriteEntity = await this.homeFavoriteService.findOneById(args.id);
		if (homeFavoritesToDelete.homeFavoriteUserId === user.id) {
			const deletedHomeFavorite = await this.homeFavoriteService.delete(args.id);
			pubSub.publish('homeFavoriteDeleted', {homeFavoriteDeleted: deletedHomeFavorite});
			return deletedHomeFavorite;
		} else {
			throw new UnauthorizedException();
		}
	}

	@Subscription('homeFavoriteCreated')
	homeFavoriteCreated() {
		return {
			subscribe: () => pubSub.asyncIterator('homeFavoriteCreated')
		};
	}
}
