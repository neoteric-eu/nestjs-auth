import {UseGuards} from '@nestjs/common';
import {Args, Mutation, Parent, Query, ResolveProperty, Resolver, Subscription} from '@nestjs/graphql';
import {Client, ClientProxy, Transport} from '@nestjs/microservices';
import {PubSub, withFilter} from 'graphql-subscriptions';
import {DateTime} from 'luxon';
import {GraphqlGuard, User as CurrentUser} from '../../_helpers/graphql';
import {AppLogger} from '../../app.logger';
import {UserEntity as User} from '../../user/entity';
import {UserService} from '../../user/user.service';
import {MessageEntity} from '../entity';
import {MESSAGE_CMD_NEW} from '../message.constants';
import {MessageService} from '../services/message.service';
import {SubscriptionsService} from '../services/subscriptions.service';
import {UserConversationService} from '../services/user-conversation.service';

@Resolver('Message')
export class MessageResolver {

	@Client({ transport: Transport.TCP })
	private client: ClientProxy;
	private pubSub = new PubSub();
	private logger = new AppLogger(MessageResolver.name);

	constructor(
		private readonly messageService: MessageService,
		private readonly userConversationService: UserConversationService,
		private readonly userService: UserService,
		private readonly subscriptionsService: SubscriptionsService) {
	}

	@Query('allMessages')
	@UseGuards(GraphqlGuard)
	async getAllMessages(
		@CurrentUser() user: User,
		@Args('conversationId') conversationId: string,
		@Args('after') after: number,
		@Args('limit') limit?: number
	) {
		return this.messageService.findAll({
			where: {
				conversationId: {
					eq: conversationId
				},
				deletedFor: {
					nin: [user.id.toString()]
				}
			},
			skip: after,
			take: limit,
			order: {
				createdAt: 'DESC'
			}
		});
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
			authorId: user.id.toString(),
			content,
			type,
			conversationId
		});

		await this.pubSub.publish('newMessage', {newMessage: createdMessage});

		this.client.send({cmd: MESSAGE_CMD_NEW}, createdMessage).subscribe(() => {}, error => {
			this.logger.error(error, '');
		});

		return createdMessage;
	}

	@Mutation('markAsRead')
	@UseGuards(GraphqlGuard)
	async markAsRead(@Args('messageId') messageId: string): Promise<MessageEntity> {
		const message = this.messageService.patch(messageId, {isRead: true});
		await this.pubSub.publish('messageUpdated', {messageUpdated: message});
		return message;
	}

	@Subscription('newMessage')
	newMessage() {
		return {
			subscribe: withFilter(() => this.pubSub.asyncIterator('newMessage'),
				(payload, variables, context) => this.subscriptionsService.newMessage(payload, variables, context))
		};
	}

	@Subscription('messageUpdated')
	messageUpdated() {
		return {
			subscribe: withFilter(() => this.pubSub.asyncIterator('messageUpdated'),
				(payload, variables, context) => this.subscriptionsService.messageUpdated(payload, variables, context))
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
