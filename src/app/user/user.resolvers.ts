import {Args, Mutation, Query, Resolver, Subscription} from '@nestjs/graphql';
import {PubSub} from 'graphql-subscriptions';
import {UserService} from './user.service';
import {User} from '../graphql.schema';
import {DeleteUserDto, UpdateUserDto} from '../user/dto';

const pubSub = new PubSub();

@Resolver('User')
export class UserResolvers {
	constructor(private readonly userService: UserService) {
	}

	@Query('me')
	async findOneById(@Args('id') id: string): Promise<User> {
		return await this.userService.findOneById(id);
	}

	@Mutation('deleteUser')
	async delete(@Args('deleteUserInput') args: DeleteUserDto): Promise<User> {
		const deletedUser = await this.userService.delete(args.id);
		pubSub.publish('userDeleted', {userDeleted: deletedUser});
		return deletedUser;
	}

	@Mutation('updateUser')
	async update(@Args('updateUserInput') args: UpdateUserDto): Promise<User> {
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
}
