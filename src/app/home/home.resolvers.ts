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

const pubSub = new PubSub();

@Resolver('Home')
@UseGuards(GraphqlGuard)
export class HomeResolvers {
	constructor(private readonly homeService: HomeService,
							private readonly attomDataService: AttomDataApiService,
							private readonly userService: UserService) {
	}

	@Query('getAVMDetail')
	async getDetail(@Args('getAVMDetailInput') args: GetAVMDetailInput) {
		const schoolsDetails = [];
		const avmDetailsResponse = await this.attomDataService.getAVMDetail({address1: args.address_1, address2: args.address_2});
		for (const property of avmDetailsResponse.data.property) {
			const propertyId = property.identifier.obPropId;
			const detailWithSchoolsResponse = await this.attomDataService.getDetailWithSchools({id: propertyId});
			const propertyWithAssociatedSchools = detailWithSchoolsResponse.data.property.find(el => el.identifier.obPropId === propertyId);
			for (const school of propertyWithAssociatedSchools.school) {
				const schoolDetailResponse = await this.attomDataService.getSchoolDetail({id: school.OBInstID});
				schoolsDetails.push(schoolDetailResponse.data.school[0]);
			}
		}
		return {
			properties: avmDetailsResponse.data.property,
			schools: schoolsDetails
		};
	}

	@Query('listHomes')
	async findAll(@Args('filter') filter?: ModelHomeFilterInput, @Args('limit') limit?: number): Promise<HomeFavorite[]> {
		console.dir(filter);
		return this.homeService.findAll({filter, limit});
	}

	@Query('getHome')
	async findOneById(@Args('id') id: string): Promise<HomeEntity> {
		return await this.homeService.findOneById(id);
	}

	@Mutation('createHome')
	async create(@CurrentUser() user: User, @Args('createHomeInput') args: CreateHomeDto): Promise<HomeEntity> {
		args.owner = user.id;
		const createdHome = await this.homeService.create(args);
		pubSub.publish('homeCreated', {homeCreated: createdHome});
		return createdHome;
	}

	@Mutation('deleteHome')
	async delete(@CurrentUser() user: User, @Args('deleteHomeInput') args: DeleteHomeDto): Promise<HomeEntity> {
		const homeToDelete: HomeEntity = await this.homeService.findOneById(args.id);
		if (homeToDelete.owner === user.id) {
			const deletedHome = await this.homeService.delete(args.id);
			pubSub.publish('homeDeleted', {homeDeleted: deletedHome});
			return deletedHome;
		} else {
			throw new UnauthorizedException();
		}
	}

	@Mutation('updateHome')
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

	@ResolveProperty('owner')
	async getOwner(@Parent() home: HomeEntity): Promise<Home> {
		return await this.userService.findOneById(home.owner);
	}
}
