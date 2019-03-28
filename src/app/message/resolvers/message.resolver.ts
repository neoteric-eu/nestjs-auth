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
import {AppLogger} from '../../app.logger';

@Resolver('Message')
export class MessageResolver {

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
	async getAllMessages(@Args('conversationId') conversationId: string, @Args('after') after: number, @Args('limit') limit?: number) {
		return this.messageService.findAll({
			where: {
				conversationId: {
					eq: conversationId
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

		return createdMessage;
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
