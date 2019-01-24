import {UnauthorizedException, UseGuards} from '@nestjs/common';
import {Args, Mutation, Query, Resolver, Subscription, ResolveProperty, Parent} from '@nestjs/graphql';
import {PubSub} from 'graphql-subscriptions';
import {GetAVMDetailInput, Home, HomeFavorite, ModelHomeFilterInput} from '../graphql.schema';
import {HomeService} from './home.service';
import {CreateHomeDto, DeleteHomeDto, UpdateHomeDto} from './dto';
import {AttomDataApiService} from './attom-data-api.service';
import {GraphqlGuard} from '../_helpers';
import {User as CurrentUser} from '../_helpers/graphql/user.decorator';
import {UserEntity as User} from '../user/entity/user.entity';
import {UserService} from '../user/user.service';
import {HomeEntity} from './entity';
import {HomeFavoriteService} from '../home-favorite/home-favorite.service';

const pubSub = new PubSub();

@Resolver('Home')
export class HomeResolvers {
	constructor(private readonly homeService: HomeService,
							private readonly attomDataService: AttomDataApiService,
							private readonly userService: UserService,
							private readonly homeFavoriteService: HomeFavoriteService) {
	}

	@Query('getAVMDetail')
	async getDetail(@Args('getAVMDetailInput') args: GetAVMDetailInput) {
		const schoolsDetails = [];

		const locationResponse = await this.attomDataService.getLocation({address: `${args.address_1} ${args.address_2}`});
		const avmDetailsResponse = await this.attomDataService.getAVMDetail({address1: args.address_1, address2: args.address_2});
		const property = avmDetailsResponse.data.property[0];
		if (locationResponse.data.results.length === 1) {
			const location = locationResponse.data.results[0].geometry.location;
			property.location.latitude = location.lat;
			property.location.longitude = location.lng;
		}
		const propertyId = property.identifier.obPropId;
		const detailWithSchoolsResponse = await this.attomDataService.getDetailWithSchools({id: propertyId});
		const schools = detailWithSchoolsResponse.data.property[0].school;
		for (const school of schools) {
			const schoolDetailResponse = await this.attomDataService.getSchoolDetail({id: school.OBInstID});
			schoolsDetails.push(schoolDetailResponse.data.school[0]);
		}

		return {
			property: property,
			schools: schoolsDetails
		};
	}

	@Query('listHomes')
	async findAll(@Args('filter') filter?: ModelHomeFilterInput, @Args('limit') limit?: number): Promise<HomeFavorite[]> {
		console.dir(filter);
		return this.homeService.findAll({filter, limit});
	}

	@Query('getHome')
	@UseGuards(GraphqlGuard)
	async findOneById(@Args('id') id: string): Promise<HomeEntity> {
		return await this.homeService.findOneById(id);
	}

	@Mutation('createHome')
	@UseGuards(GraphqlGuard)
	async create(@CurrentUser() user: User, @Args('createHomeInput') args: CreateHomeDto): Promise<HomeEntity> {
		args.owner = user.id;
		const createdHome = await this.homeService.create(args);
		pubSub.publish('homeCreated', {homeCreated: createdHome});
		return createdHome;
	}

	@Mutation('deleteHome')
	@UseGuards(GraphqlGuard)
	async delete(@CurrentUser() user: User, @Args('deleteHomeInput') args: DeleteHomeDto): Promise<HomeEntity> {
		const homeToDelete: HomeEntity = await this.homeService.findOneById(args.id);
		if (homeToDelete.owner === user.id) {
			await this.homeFavoriteService.deleteAll({filter: {homeFavoriteHomeId: {eq: args.id}}});
			const deletedHome = await this.homeService.delete(args.id);
			pubSub.publish('homeDeleted', {homeDeleted: deletedHome});
			return deletedHome;
		} else {
			throw new UnauthorizedException();
		}
	}

	@Mutation('updateHome')
	@UseGuards(GraphqlGuard)
	async update(@CurrentUser() user: User, @Args('updateHomeInput') args: UpdateHomeDto): Promise<HomeEntity> {
		const homeToUpdate: HomeEntity = await this.homeService.findOneById(args.id);
		if (homeToUpdate.owner === user.id) {
			args.owner = user.id;
			const updatedHome = await this.homeService.update(args);
			pubSub.publish('homeUpdated', {homeUpdated: updatedHome});
			return updatedHome;
		} else {
			throw new UnauthorizedException();
		}
	}

	@Subscription('homeCreated')
	homeCreated() {
		return {
			subscribe: () => pubSub.asyncIterator('homeCreated')
		};
	}

	@Subscription('homeDeleted')
	homeDeleted() {
		return {
			subscribe: () => pubSub.asyncIterator('homeDeleted')
		};
	}

	@Subscription('homeUpdated')
	homeUpdated() {
		return {
			subscribe: () => pubSub.asyncIterator('homeUpdated')
		};
	}

	@ResolveProperty('owner')
	async getOwner(@Parent() home: HomeEntity): Promise<Home> {
		return await this.userService.findOneById(home.owner);
	}
}
