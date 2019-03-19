import {Resolver, Args, Mutation, Query, ResolveProperty, Parent, Subscription} from '@nestjs/graphql';
import {PubSub, withFilter} from 'graphql-subscriptions';
import {GraphqlGuard, User as CurrentUser} from '../../_helpers/graphql';
import {UserEntity as User} from '../../user/entity';
import {UseGuards} from '@nestjs/common';
import {MessageEntity} from '../entity';
import {UserService} from '../../user/user.service';
import {MessageService} from '../services/message.service';
import {UserConversationService} from '../services/user-conversation.service';
import {SubscriptionsService} from '../services/subscriptions.service';

@Resolver('Message')
export class MessageResolver {

	private pubSub = new PubSub();

	constructor(
		private readonly messageService: MessageService,
		private readonly userConversationService: UserConversationService,
		private readonly userService: UserService,
		private readonly subscriptionsService: SubscriptionsService) {
	}

	@Query('allMessages')
	@UseGuards(GraphqlGuard)
	async getAllMessages(@Args('conversationId') conversationId: string, @Args('after') after: string, @Args('limit') limit?: number) {
		return this.messageService.findAll({filter: {conversationId: {eq: conversationId}}, limit});
	}

	@Mutation('createMessage')
	@UseGuards(GraphqlGuard)
	async createMessage(
		@CurrentUser() user: User,
		@Args('conversationId') conversationId: string,
		@Args('content') content: string,
		@Args('type') type: string
	) {
		const createdMessage = await this.messageService.create({
			authorId: user.id,
			content,
			type,
			conversationId
		});
		await this.pubSub.publish('newMessage', {newMessage: createdMessage});

		return createdMessage;
	}

	@Subscription('newMessage')
	newMessage() {
		return {
			subscribe: withFilter(() => this.pubSub.asyncIterator('newMessage'),
				(payload, variables, context) => this.subscriptionsService.newMessage(payload, variables, context))
		};
	}

	@ResolveProperty('author')
	async getAuthor(@Parent() message: MessageEntity): Promise<User> {
		try {
			return this.userService.findOneById(message.authorId);
		} catch (e) {
			return this.userService.create({});
		}
	}
}
