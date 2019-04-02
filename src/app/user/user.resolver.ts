import {Args, Mutation, Query, Resolver, Subscription} from '@nestjs/graphql';
import {PubSub} from 'graphql-subscriptions';
import {UserService} from './user.service';
import {DeleteUserDto, UpdateUserDto} from './dto';
import {UseGuards} from '@nestjs/common';
import {GraphqlGuard} from '../_helpers/graphql';
import {UserEntity} from './entity';
import {User as CurrentUser} from '../_helpers/graphql/user.decorator';

@Resolver('User')
@UseGuards(GraphqlGuard)
export class UserResolver {
	private pubSub = new PubSub();

	constructor(private readonly userService: UserService) {
	}

	@Query('me')
	async getMe(@CurrentUser() user: UserEntity): Promise<UserEntity> {
		return user;
	}

	@Mutation('deleteUser')
	async delete(@Args('deleteUserInput') args: DeleteUserDto): Promise<UserEntity> {
		const deletedUser = await this.userService.delete(args.id);
		await this.pubSub.publish('userDeleted', {userDeleted: deletedUser});
		return deletedUser;
	}

	@Mutation('updateUser')
	async update(@CurrentUser() user: UserEntity, @Args('updateUserInput') args: UpdateUserDto): Promise<UserEntity> {
		const updatedUser = await this.userService.patch(user.id.toString(), args);
		await this.pubSub.publish('userUpdated', {userUpdated: updatedUser});
		return updatedUser;
	}

	@Subscription('userCreated')
	userCreated() {
		return {
			subscribe: () => this.pubSub.asyncIterator('userCreated')
		};
	}

	@Subscription('userDeleted')
	userDeleted() {
		return {
			subscribe: () => this.pubSub.asyncIterator('userDeleted')
		};
	}
}
