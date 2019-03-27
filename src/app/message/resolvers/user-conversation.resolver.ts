import {UseGuards} from '@nestjs/common';
import {Args, Mutation, Parent, Query, ResolveProperty, Resolver, Subscription} from '@nestjs/graphql';
import {MessagePattern} from '@nestjs/microservices';
import {PubSub, withFilter} from 'graphql-subscriptions';
import {DateTime} from 'luxon';
import {GraphqlGuard, User as CurrentUser} from '../../_helpers/graphql';
import {AppLogger} from '../../app.logger';
import {CreateConversationInput} from '../../graphql.schema';
import {UserEntity as User} from '../../user/entity';
import {UserService} from '../../user/user.service';
import {ConversationEntity, MessageEntity, UserConversationEntity} from '../entity';
import {MESSAGE_CMD_NEW} from '../message.constants';
import {ConversationService} from '../services/conversation.service';
import {MessageService} from '../services/message.service';
import {SubscriptionsService} from '../services/subscriptions.service';
import {UserConversationService} from '../services/user-conversation.service';


@Resolver('UserConversation')
export class UserConversationResolver {

	private pubSub = new PubSub();
	private logger = new AppLogger(UserConversationResolver.name);

	constructor(
		private readonly conversationService: ConversationService,
		private readonly userConversationService: UserConversationService,
		private readonly messageService: MessageService,
		private readonly userService: UserService,
		private readonly subscriptionsService: SubscriptionsService) {
	}

	@Query('allConversations')
	@UseGuards(GraphqlGuard)
	async getAllConversations(@CurrentUser() user: User) {
		return this.userConversationService.findAll({where: {userId: {eq: user.id.toString()}}});
	}

	@Mutation('createConversation')
	@UseGuards(GraphqlGuard)
	async createConversation(@CurrentUser() user: User, @Args('conversationInput') conversationInput: CreateConversationInput) {
		const createdConversation = await this.conversationService.create(conversationInput);

		const createdAuthorConversation = await this.userConversationService
			.create({userId: user.id.toString(), conversationId: createdConversation.id.toString()});
		await this.userConversationService
			.create({userId: conversationInput.recipientId.toString(), conversationId: createdConversation.id.toString()});

		await this.pubSub.publish('newUserConversation', {newUserConversation: createdAuthorConversation});

		return createdAuthorConversation;
	}

	@Subscription('newUserConversation')
	@UseGuards(GraphqlGuard)
	newUserConversation() {
		return {
			subscribe: withFilter(() => this.pubSub.asyncIterator('newUserConversation'),
				(payload, variables, context) => this.subscriptionsService.newUserConversation(payload, variables, context))
		};
	}

	@Subscription('userConversationUpdated')
	@UseGuards(GraphqlGuard)
	userConversationUpdated() {
		return {
			subscribe: withFilter(() => this.pubSub.asyncIterator('userConversationUpdated'),
				(payload, variables, context) => this.subscriptionsService.userConversationUpdated(payload, variables, context))
		};
	}

	@ResolveProperty('user')
	async getUser(@Parent() userConversation: UserConversationEntity): Promise<User> {
		try {
			return this.userService.findOneById(userConversation.userId);
		} catch (e) {
			return this.userService.create({});
		}
	}

	@ResolveProperty('conversation')
	async getConversation(@Parent() userConversation: UserConversationEntity): Promise<ConversationEntity> {
		try {
			return this.conversationService.findOneById(userConversation.conversationId);
		} catch (e) {
			return this.conversationService.create({});
		}
	}

	@ResolveProperty('message')
	async getMessage(@Parent() userConversation: UserConversationEntity): Promise<MessageEntity> {
		return this.messageService.findOne({
			where: {
				conversationId: {
					eq: userConversation.conversationId
				}
			},
			order: {
				createdAt: 'DESC'
			}
		});
	}

	@MessagePattern({cmd: MESSAGE_CMD_NEW})
	public async onMessageNew(message: MessageEntity): Promise<void> {
		this.logger.debug(`[onMessageNew] new message ${message.id}`);
		const userConversations = await this.userConversationService.findAll({
			where: {
				conversationId: {
					eq: message.conversationId
				},
				userId: {
					ne: message.authorId
				}
			}
		});
		for (const userConversation of userConversations) {
			userConversation.updatedAt = DateTime.utc();
			await userConversation.save();
			await this.pubSub.publish('userConversationUpdated', {userConversationUpdated: userConversation});
		}
	}
}
