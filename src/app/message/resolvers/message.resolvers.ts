import {Resolver, Args, Mutation, Query, ResolveProperty, Parent, Subscription} from '@nestjs/graphql';
import {PubSub, withFilter} from 'graphql-subscriptions';
import {GraphqlGuard, User as CurrentUser} from '../../_helpers/graphql';
import {UserEntity as User} from '../../user/entity';
import {UseGuards} from '@nestjs/common';
import {MessageEntity} from '../entity';
import {UserService} from '../../user/user.service';
import {MessageService} from '../services/message.service';

const pubSub = new PubSub();

@Resolver('Message')
export class MessageResolvers {
	constructor(
		private readonly messageService: MessageService,
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
	@UseGuards(GraphqlGuard)
	newMessage() {
		return {
			subscribe: withFilter(() => pubSub.asyncIterator('newMessage'), (payload, variables) => {
				return payload.newMessage.conversationId === variables.conversationId;
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
