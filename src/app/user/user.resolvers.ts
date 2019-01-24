import {Args, Mutation, Query, Resolver, Subscription} from '@nestjs/graphql';
import {PubSub} from 'graphql-subscriptions';
import {UserService} from './user.service';
import {DeleteUserDto, UpdateUserDto} from '../user/dto';
import {UseGuards} from '@nestjs/common';
import {GraphqlGuard} from '../_helpers/graphql';
import {UserEntity} from './entity';
import {User as CurrentUser} from '../_helpers/graphql/user.decorator';

const pubSub = new PubSub();

@Resolver('User')
@UseGuards(GraphqlGuard)
export class UserResolvers {
	constructor(private readonly userService: UserService) {
	}

	@Query('me')
	async getMe(@CurrentUser() user: UserEntity): Promise<UserEntity> {
		console.log(user);
		return user;
	}

	@Mutation('deleteUser')
	async delete(@Args('deleteUserInput') args: DeleteUserDto): Promise<UserEntity> {
		const deletedUser = await this.userService.delete(args.id);
		pubSub.publish('userDeleted', {userDeleted: deletedUser});
		return deletedUser;
	}

	@Mutation('updateUser')
	async update(@Args('updateUserInput') args: UpdateUserDto): Promise<UserEntity> {
		const updatedUser = await this.userService.update(args);
		pubSub.publish('userUpdated', {userUpdated: updatedUser});
		return updatedUser;
	}

	@Subscription('userCreated')
	userCreated() {
		return {
			subscribe: () => pubSub.asyncIterator('userCreated')
		};
	}

	@Subscription('userDeleted')
	userDeleted() {
		return {
			subscribe: () => pubSub.asyncIterator('userDeleted')
		};
	}
}
