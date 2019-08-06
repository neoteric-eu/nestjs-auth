import {UseGuards} from '@nestjs/common';
import {Args, Mutation, Parent, Query, ResolveProperty, Resolver, Subscription} from '@nestjs/graphql';
import {Client, ClientProxy, Transport} from '@nestjs/microservices';
import {PubSub, withFilter} from 'graphql-subscriptions';
import {GraphqlGuard, User as CurrentUser} from '../../_helpers/graphql';
import {AppLogger} from '../../app.logger';
import {AllMessagesFilterInput} from '../../graphql.schema';
import {UserEntity as User} from '../../user/entity';
import {UserService} from '../../user/user.service';
import {MessageEntity} from '../entity';
import {MESSAGE_CMD_NEW} from '../message.constants';
import {MessageService} from '../services/message.service';
import {SubscriptionsService} from '../services/subscriptions.service';
import {UserConversationService} from '../services/user-conversation.service';

@Resolver('Message')
export class MessageResolver {

	@Client({transport: Transport.TCP})
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
		@Args('filter') filter: AllMessagesFilterInput,
		@Args('after') after: number,
		@Args('limit') limit?: number
	) {
		return this.messageService.findAll({
			where: {
				...filter,
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

		this.client.send({cmd: MESSAGE_CMD_NEW}, createdMessage).subscribe(() => {
		}, error => {
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

	@Mutation('startTyping')
	@UseGuards(GraphqlGuard)
	async startTyping(@CurrentUser() user: User, @Args('conversationId') conversationId: string): Promise<boolean> {
		this.logger.debug(`[startTyping] for conversation ${conversationId}`);
		const userConversation = await this.userConversationService.findOne({where: {conversationId: {eq: conversationId}}});
		this.logger.debug(`[startTyping] publishing subscription`);
		await this.pubSub.publish('startTyping', {startTyping: userConversation});
		return true;
	}

	@Mutation('stopTyping')
	@UseGuards(GraphqlGuard)
	async stopTyping(@CurrentUser() user: User, @Args('conversationId') conversationId: string): Promise<boolean> {
		this.logger.debug(`[stopTyping] for conversation ${conversationId}`);
		const userConversation = await this.userConversationService.findOne({where: {conversationId: {eq: conversationId}}});
		this.logger.debug(`[stopTyping] publishing subscription`);
		await this.pubSub.publish('stopTyping', {stopTyping: userConversation});
		return true;
	}

	@Mutation('deleteMessage')
	@UseGuards(GraphqlGuard)
	async deleteMessage(
		@CurrentUser() user: User,
		@Args('messageId') messageId: string,
		@Args('forEveryone') forEveryone: boolean = false
	): Promise<boolean> {
		const message = await this.messageService.findOneById(messageId);
		message.deletedFor = [user.id.toString()];
		if (forEveryone) {
			const allConversations = await this.userConversationService.findAll({where: {conversationId: {eq: message.conversationId}}});
			message.deletedFor = allConversations.map(userConversation => userConversation.userId);
		}
		await this.pubSub.publish('messageDeleted', {messageDeleted: message});
		return !!this.messageService.softDelete(message);
	}

	@Subscription('messageUpdated')
	messageUpdated() {
		return {
			subscribe: withFilter(() => this.pubSub.asyncIterator('messageUpdated'),
				(payload, variables, context) => this.subscriptionsService.messageUpdated(payload, variables, context))
		};
	}

	@Subscription('messageDeleted')
	messageDeleted() {
		return {
			subscribe: withFilter(() => this.pubSub.asyncIterator('messageDeleted'),
				(payload, variables, context) => this.subscriptionsService.messageDeleted(payload, variables, context))
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

	@Subscription('newMessage')
	newMessage() {
		return {
			subscribe: withFilter(() => this.pubSub.asyncIterator('newMessage'),
				(payload, variables, context) => this.subscriptionsService.newMessage(payload, variables, context))
		};
	}

	@Subscription('startTyping')
	onStartTyping() {
		return {
			subscribe: withFilter(() => this.pubSub.asyncIterator('startTyping'),
				(payload, variables, context) => this.subscriptionsService.startTyping(payload, variables, context))
		};
	}

	@Subscription('stopTyping')
	onStopTyping() {
		return {
			subscribe: withFilter(() => this.pubSub.asyncIterator('stopTyping'),
				(payload, variables, context) => this.subscriptionsService.stopTyping(payload, variables, context))
		};
	}
}
