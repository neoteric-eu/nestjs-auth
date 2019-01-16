import {ParseIntPipe, UseGuards} from '@nestjs/common';
import {Args, Mutation, Query, Resolver, Subscription} from '@nestjs/graphql';
import {PubSub} from 'graphql-subscriptions';
import {Home} from '../graphql.schema';
import {HomeGuard} from './home.guard';
import {HomeService} from './home.service';
import {CreateHomeDto, DeleteHomeDto, UpdateHomeDto} from './dto';

const pubSub = new PubSub();

@Resolver('Home')
export class HomeResolvers {
	constructor(private readonly homeService: HomeService) {
	}

	@Query('listHomes')
	@UseGuards(HomeGuard)
	async findOne() {
		// return await this.homeService.findAll();
	}

	@Query('getHome')
	async findOneById(@Args('id') id: string): Promise<Home> {
		return await this.homeService.findOneById(id);
	}

	@Mutation('createHome')
	async create(@Args('createHomeInput') args: CreateHomeDto): Promise<Home> {
		const createdHome = await this.homeService.create(args);
		pubSub.publish('homeCreated', {homeCreated: createdHome});
		return createdHome;
	}

	@Mutation('deleteHome')
	async delete(@Args('deleteHomeInput') args: DeleteHomeDto): Promise<Home> {
		const deletedHome = await this.homeService.delete(args.id);
		pubSub.publish('homeDeleted', {homeDeleted: deletedHome});
		return deletedHome;
	}

	@Mutation('updateHome')
	async update(@Args('updateHomeInput') args: UpdateHomeDto): Promise<Home> {
		const updatedHome = await this.homeService.update(args);
		pubSub.publish('homeUpdated', {homeUpdated: updatedHome});
		return updatedHome;
	}

	@Subscription('homeCreated')
	homeCreated() {
		return {
			subscribe: () => pubSub.asyncIterator('homeCreated')
		};
	}
}
