import {UseGuards} from '@nestjs/common';
import {Args, Mutation, Parent, Query, ResolveProperty, Resolver, Subscription} from '@nestjs/graphql';
import {PubSub} from 'graphql-subscriptions';
import {DeepPartial} from 'typeorm';
import {GraphqlGuard} from '../_helpers';
import {User} from '../_helpers/graphql';
import {AppLogger} from '../app.logger';
import {ContractFilterInput} from '../graphql.schema';
import {HomeEntity} from '../home/entity';
import {HomeService} from '../home/home.service';
import {UserEntity} from '../user/entity';
import {UserService} from '../user/user.service';
import {ContractService} from './contract.service';
import {ContractEntity} from './entity';

@Resolver('Contract')
@UseGuards(GraphqlGuard)
export class ContractResolver {

	private pubSub = new PubSub();
	private logger = new AppLogger(ContractResolver.name);

	constructor(
		private readonly contractService: ContractService,
		private readonly homeService: HomeService,
		private readonly userService: UserService
	) {
	}

	@Query('allContractsAsBuyer')
	async allContractsAsBuyer(
		@User() user: UserEntity,
		@Args('filter') filter?: ContractFilterInput,
		@Args('limit') limit?: number
	): Promise<ContractEntity[]> {
		this.logger.log(`[allContractsAsBuyer] ${JSON.stringify(filter)}`);
		return this.contractService.findAll({
			where: {
				...filter,
				userId: {
					eq: user.id.toString()
				},
				isDeleted: {
					eq: false
				}
			},
			take: limit
		});
	}

	@Query('allContractsAsSeller')
	async allContractsAsSeller(
		@User() user: UserEntity,
		@Args('filter') filter: ContractFilterInput = {},
		@Args('limit') limit?: number
	) {
		this.logger.log(`[allContractsAsSeller] ${JSON.stringify(filter)}`);
		const homes = await this.homeService.findAll({
			where: {
				owner: {
					eq: user.id.toString()
				}
			}
		});
		// @ts-ignore
		filter.home = {in: homes.map(home => home.id.toString())};

		return this.contractService.findAll({
			where: {
				...filter
			},
			take: limit
		});
	}

	@Query('getContract')
	async getContract(@Args('id') id: string): Promise<ContractEntity> {
		this.logger.log(`[getContract] ${id}`);
		return this.contractService.findOneById(id);
	}

	@Mutation('createContract')
	async createContract(@User() user: UserEntity, @Args('input') data: DeepPartial<ContractEntity>): Promise<ContractEntity> {
		this.logger.log(`[createContract] ${JSON.stringify(data)}`);
		const contract = this.contractService.create({
			...data,
			userId: user.id.toString()
		});
		await this.pubSub.publish('newContract', {newContract: contract});
		return contract;
	}

	@Mutation('updateContract')
	async updateContract(@Args('id') id: string, @Args('input') data: DeepPartial<ContractEntity>) {
		this.logger.log(`[updateContract] ${JSON.stringify(data)}`);
		const contract = this.contractService.patch(id, data);
		await this.pubSub.publish('updatedContract', {updatedContract: contract});
		return contract;
	}

	@Mutation('deleteContract')
	async deleteContract(@Args('id') id: string) {
		this.logger.log(`[deleteContract] ${id}`);
		const contract = await this.contractService.findOneById(id);
		await this.contractService.softDelete(contract);
		await this.pubSub.publish('deletedContract', {deletedContract: contract});
		return contract;
	}

	@Subscription('newContract')
	onNewContract() {
		return {
			subscribe: () => this.pubSub.asyncIterator('newContract')
		};
	}

	@Subscription('updatedContract')
	onUpdatedContract() {
		return {
			subscribe: () => this.pubSub.asyncIterator('updatedContract')
		};
	}

	@Subscription('deletedContract')
	onDeletedContract() {
		return {
			subscribe: () => this.pubSub.asyncIterator('deletedContract')
		};
	}

	@ResolveProperty('user')
	async getUser(@Parent() contract: ContractEntity): Promise<UserEntity> {
		return this.userService.findOneById(contract.userId);
	}

	@ResolveProperty('home')
	async getHome(@Parent() contract: ContractEntity): Promise<HomeEntity> {
		return this.homeService.findOneById(contract.home_id);
	}
}
