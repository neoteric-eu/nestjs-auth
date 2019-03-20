import {Resolver, ResolveProperty, Parent, Mutation, Args, Query, Subscription} from '@nestjs/graphql';
import {ConversationService} from '../services/conversation.service';
import {UserService} from '../../user/user.service';
import {ConversationEntity, UserConversationEntity} from '../entity';
import {Conversation, CreateConversationInput} from '../../graphql.schema';
import {UserEntity as User} from '../../user/entity';
import {UseGuards} from '@nestjs/common';
import {GraphqlGuard, User as CurrentUser} from '../../_helpers/graphql';
import {UserConversationService} from '../services/user-conversation.service';
import {PubSub, withFilter} from 'graphql-subscriptions';
import {SubscriptionsService} from '../services/subscriptions.service';


@Resolver('UserConversation')
export class UserConversationResolver {

	private pubSub = new PubSub();

	constructor(
		private readonly conversationService: ConversationService,
		private readonly userConversationService: UserConversationService,
		private readonly userService: UserService,
		private readonly subscriptionsService: SubscriptionsService) {
	}

	@Query('allConversations')
	@UseGuards(GraphqlGuard)
	async getAllConversations(@CurrentUser() user: User) {
		return this.userConversationService.findAll({where: {userId: user.id}});
	}

	@Mutation('createConversation')
	@UseGuards(GraphqlGuard)
	async createConversation(@CurrentUser() user: User, @Args('conversationInput') conversationInput: CreateConversationInput) {
		const createdConversation = await this.conversationService.create(conversationInput);

		const createdAuthorConversation = await this.userConversationService
			.create({userId: user.id, conversationId: createdConversation.id});
		await this.userConversationService
			.create({userId: conversationInput.recipientId, conversationId: createdConversation.id});

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
}
