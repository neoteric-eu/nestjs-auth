import {UseGuards} from '@nestjs/common';
import {Args, Mutation, Query, Resolver, Subscription} from '@nestjs/graphql';
import {PubSub} from 'graphql-subscriptions';
import {HomeFavoriteService} from './home-favorite.service';
import {HomeFavorite} from '../graphql.schema';
import {CreateHomeFavoriteDto, DeleteHomeFavoriteDto} from './dto';
import {GraphqlGuard} from '../_helpers';
import {User as CurrentUser} from '../_helpers/graphql/user.decorator';
import {UserEntity as User} from '../user/entity';

@Resolver('HomeFavorite')
@UseGuards(GraphqlGuard)
export class HomeFavoriteResolver {
	private pubSub = new PubSub();

	constructor(private readonly homeFavoriteService: HomeFavoriteService) {
	}

	@Query('getHomeFavorites')
	async findAll(@CurrentUser() user: User): Promise<HomeFavorite[]> {
		return this.homeFavoriteService.findAll({where : {homeFavoriteUserId: user.id}});
	}

	@Query('getHomeFavorite')
	async findOneById(@Args('id') id: string): Promise<HomeFavorite> {
		return this.homeFavoriteService.findOneById(id);
	}

	@Mutation('createHomeFavorite')
	async create(@CurrentUser() user: User, @Args('createHomeFavoriteInput') args: CreateHomeFavoriteDto): Promise<HomeFavorite> {
		args.homeFavoriteUserId = user.id;
		const createdHomeFavorite = await this.homeFavoriteService.create(args);
		await this.pubSub.publish('homeFavoriteCreated', {homeCreatedFavorite: createdHomeFavorite});
		return createdHomeFavorite;
	}

	@Mutation('deleteHomeFavorite')
	async delete(@CurrentUser() user: User, @Args('deleteHomeFavoriteInput') args: DeleteHomeFavoriteDto): Promise<HomeFavorite> {
		const deletedHomeFavorite = await this.homeFavoriteService.delete(args.id);
		await this.pubSub.publish('homeFavoriteDeleted', {homeFavoriteDeleted: deletedHomeFavorite});
		return deletedHomeFavorite;
	}

	@Subscription('homeFavoriteCreated')
	homeFavoriteCreated() {
		return {
			subscribe: () => this.pubSub.asyncIterator('homeFavoriteCreated')
		};
	}
}
