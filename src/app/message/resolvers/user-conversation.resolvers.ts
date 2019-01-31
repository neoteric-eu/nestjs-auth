import {Resolver, ResolveProperty, Parent, Mutation, Args, Query, Subscription} from '@nestjs/graphql';
import {ConversationService} from '../services/conversation.service';
import {UserService} from '../../user/user.service';
import {UserConversationEntity} from '../entity';
import {Conversation, CreateConversationInput} from '../../graphql.schema';
import {UserEntity as User} from '../../user/entity';
import {UseGuards} from '@nestjs/common';
import {GraphqlGuard, User as CurrentUser} from '../../_helpers/graphql';
import {UserConversationService} from '../services/user-conversation.service';
import {PubSub, withFilter} from 'graphql-subscriptions';
import {AppLogger} from '../../app.logger';
import {MessageResolvers} from './message.resolvers';

const pubSub = new PubSub();


@Resolver('UserConversation')
export class UserConversationResolvers {
	private logger = new AppLogger(MessageResolvers.name);

	constructor(
		private readonly conversationService: ConversationService,
		private readonly userConversationService: UserConversationService,
		private readonly userService: UserService) {
	}

	@Query('allConversations')
	@UseGuards(GraphqlGuard)
	async getAllConversations(@CurrentUser() user: User) {
		return this.userConversationService.findAll({filter: {userId: {eq: user.id}}});
	}

	@Mutation('createConversation')
	@UseGuards(GraphqlGuard)
	async createConversation(@CurrentUser() user: User, @Args('conversationInput') conversationInput: CreateConversationInput) {
		const createdConversation = await this.conversationService.create(conversationInput);

		const createdAuthorConversation = await this.userConversationService
			.create({userId: user.id, conversationId: createdConversation.id});
		const createdRecipientConversation = await this.userConversationService
			.create({userId: conversationInput.recipientId, conversationId: createdConversation.id});

		pubSub.publish('newUserConversation', {newUserConversation: createdAuthorConversation});

		return createdAuthorConversation;
	}

	@Subscription('newUserConversation')
	@UseGuards(GraphqlGuard)
	newUserConversation() {
		return {
			subscribe: withFilter(() => pubSub.asyncIterator('newUserConversation'), async (payload, variables, context) => {
				const user = context.req.user;
				if (payload.newUserConversation.userId !== variables.userId) {
					this.logger.debug(`[newMessage] different userId for listening`);
					return false;
				}

				return variables.userId === user.id;
			})
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
	async getConversation(@Parent() userConversation: UserConversationEntity): Promise<Conversation> {
		try {
			return this.conversationService.findOneById(userConversation.conversationId);
		} catch (e) {
			return this.conversationService.create({});
		}
	}
}
