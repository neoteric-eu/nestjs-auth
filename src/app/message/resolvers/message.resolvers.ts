import {Resolver, Args, Mutation, Query, ResolveProperty, Parent, Subscription} from '@nestjs/graphql';
import {PubSub, withFilter} from 'graphql-subscriptions';
import {GraphqlGuard, User as CurrentUser} from '../../_helpers/graphql';
import {UserEntity as User} from '../../user/entity';
import {UseGuards} from '@nestjs/common';
import {MessageEntity} from '../entity';
import {UserService} from '../../user/user.service';
import {MessageService} from '../services/message.service';
import {UserConversationService} from '../services/user-conversation.service';
import {AppLogger} from '../../app.logger';

const pubSub = new PubSub();

@Resolver('Message')
export class MessageResolvers {
	private logger = new AppLogger(MessageResolvers.name);

	constructor(
		private readonly messageService: MessageService,
		private readonly userConversationService: UserConversationService,
		private readonly userService: UserService) {
	}

	@Query('allMessages')
	@UseGuards(GraphqlGuard)
	async getAllMessages(@Args('conversationId') conversationId: string, @Args('after') after: string, @Args('limit') limit: number) {
		return this.messageService.findAll({filter: {conversationId: {eq: conversationId}}});
	}

	@Mutation('createMessage')
	@UseGuards(GraphqlGuard)
	async createMessage(@CurrentUser() user: User, @Args('conversationId') conversationId: string, @Args('content') content: string) {
		const createdMessage = await this.messageService.create({
			authorId: user.id,
			content,
			conversationId
		});
		pubSub.publish('newMessage', {newMessage: createdMessage});

		return createdMessage;
	}

	@Subscription('newMessage')
	newMessage() {
		return {
			subscribe: withFilter(() => pubSub.asyncIterator('newMessage'), async (payload, variables, context) => {
				const user = context.req.user;
				if (payload.newMessage.conversationId !== variables.conversationId) {
					this.logger.debug(`[newMessage] different conversationId for listening`);
					return false;
				}
				const conversations = await this.userConversationService.findAll({ filter: { userId: { eq: user.id }}});
				const found = conversations.some(conversation => conversation.conversationId === variables.conversationId);
				this.logger.debug(`[newMessage] Do we found this conversation for this user? ${found}`);
				return found;
			})
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
