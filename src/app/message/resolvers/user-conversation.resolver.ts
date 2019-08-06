import {HttpException, HttpStatus, UseGuards} from '@nestjs/common';
import {Args, Mutation, Parent, Query, ResolveProperty, Resolver, Subscription} from '@nestjs/graphql';
import {PubSub, withFilter} from 'graphql-subscriptions';
import {GraphqlGuard, User as CurrentUser} from '../../_helpers/graphql';
import {CreateConversationInput} from '../../graphql.schema';
import {UserEntity as User} from '../../user/entity';
import {UserService} from '../../user/user.service';
import {ConversationEntity, MessageEntity, UserConversationEntity} from '../entity';
import {ConversationService} from '../services/conversation.service';
import {MessageService} from '../services/message.service';
import {SubscriptionsService} from '../services/subscriptions.service';
import {UserConversationService} from '../services/user-conversation.service';


@Resolver('UserConversation')
export class UserConversationResolver {

	private pubSub = new PubSub();

	constructor(
		private readonly conversationService: ConversationService,
		private readonly userConversationService: UserConversationService,
		private readonly messageService: MessageService,
		private readonly userService: UserService,
		private readonly subscriptionsService: SubscriptionsService
	) {
		this.messageService.pubSub = this.pubSub;
	}

	@Query('allConversations')
	@UseGuards(GraphqlGuard)
	async getAllConversations(@CurrentUser() user: User) {
		return this.userConversationService.findAll({
			where: {
				userId: {
					eq: user.id.toString()
				},
				isDeleted: {
					eq: false
				}
			}
		});
	}

	@Mutation('createConversation')
	@UseGuards(GraphqlGuard)
	async createConversation(@CurrentUser() user: User, @Args('conversationInput') conversationInput: CreateConversationInput) {

		const [conversation, created] = await this.userConversationService.createConversationIfMissing(user, conversationInput);

		if (created) {
			await this.pubSub.publish('newUserConversation', {newUserConversation: conversation});
		}

		return conversation;
	}

	@Mutation('deleteConversation')
	@UseGuards(GraphqlGuard)
	async deleteMessage(
		@CurrentUser() user: User,
		@Args('conversationId') conversationId: string
	): Promise<boolean> {
		const userConversation = await this.userConversationService.findOne({
			where: {
				userId: {
					eq: user.id.toString()
				},
				conversationId: {
					eq: conversationId
				}
			}
		});
		if (!userConversation) {
			throw new HttpException({
				error: 'Database',
				message: 'Item not found'
			}, HttpStatus.NOT_FOUND);
		}
		await this.userConversationService.softDelete(userConversation);
		await this.pubSub.publish('userConversationDeleted', {conversationDeleted: userConversation});
		return true;
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

	@Subscription('userConversationDeleted')
	@UseGuards(GraphqlGuard)
	userConversationDeleted() {
		return {
			subscribe: withFilter(() => this.pubSub.asyncIterator('userConversationDeleted'),
				(payload, variables, context) => this.subscriptionsService.userConversationDeleted(payload, variables, context))
		};
	}

	@ResolveProperty('user')
	async getUser(@Parent() userConversation: UserConversationEntity): Promise<User> {
		try {
			return this.userService.findOneById(userConversation.userId);
		} catch (e) {
			return {} as any;
		}
	}

	@ResolveProperty('conversation')
	async getConversation(@Parent() userConversation: UserConversationEntity): Promise<ConversationEntity> {
		try {
			return this.conversationService.findOneById(userConversation.conversationId);
		} catch (e) {
			return {} as any;
		}
	}

	@ResolveProperty('message')
	async getMessage(@CurrentUser() user: User, @Parent() userConversation: UserConversationEntity): Promise<MessageEntity> {
		return this.messageService.findOne({
			where: {
				conversationId: {
					eq: userConversation.conversationId
				},
				deletedFor: {
					nin: [user.id.toString()]
				}
			},
			order: {
				createdAt: 'DESC'
			}
		});
	}
}
