import {Resolver, Args, Mutation, Query} from '@nestjs/graphql';
import {PubSub} from 'graphql-subscriptions';
import {User as CurrentUser} from '../_helpers/graphql';
import {UserEntity as User} from '../user/entity';

const pubSub = new PubSub();

@Resolver('Message')
export class MessageResolvers {
	constructor() {
	}

	@Query('allMessages')
	async getAllMessages(@Args('conversationId') conversationId: string, @Args('after') after: string, @Args('first') first: number) {
	}

	@Query('allMessagesFrom')
	async getAllMessagesFrom(
		@Args('conversationId') conversationId: string,
		@Args('sender') sender: string,
		@Args('after') after: string,
		@Args('first') first: number) {
	}

	@Query('allConversations')
	async getAllConversations() {
	}

	@Mutation('createConversation')
	async createConversation(@CurrentUser() user: User, @Args('name') name: string) {

	}

	@Mutation('createMessage')
	async createMessage(@CurrentUser() user: User, @Args('conversationId') conversationId: string, @Args('content') content: string) {

	}

	@Mutation('createUserConversations')
	async createUserConversations(@CurrentUser() user: User, @Args('conversationId') conversationId: string) {
	}
}
