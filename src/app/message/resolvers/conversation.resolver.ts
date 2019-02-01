import {Resolver, ResolveProperty, Parent} from '@nestjs/graphql';
import {ConversationEntity} from '../entity';
import {Conversation} from '../../graphql.schema';
import {MessageService} from '../services/message.service';

@Resolver('Conversation')
export class ConversationResolver {
	constructor(private readonly messageService: MessageService) {
	}

	@ResolveProperty('messages')
	async getMessage(@Parent() conversation: ConversationEntity): Promise<any> {
		try {
			return this.messageService.findAll({filter: {conversationId: {eq: conversation.id}}});
		} catch (e) {
			return this.messageService.create({});
		}
	}
}
