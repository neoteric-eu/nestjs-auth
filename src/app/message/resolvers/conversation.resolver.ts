import {Resolver, ResolveProperty, Parent} from '@nestjs/graphql';
import {HomeEntity} from '../../home/entity';
import {HomeService} from '../../home/home.service';
import {ConversationEntity} from '../entity';
import {Conversation} from '../../graphql.schema';
import {MessageService} from '../services/message.service';

@Resolver('Conversation')
export class ConversationResolver {
	constructor(
		private readonly messageService: MessageService,
		private readonly homeService: HomeService
		) {
	}

	@ResolveProperty('messages')
	async getMessage(@Parent() conversation: ConversationEntity): Promise<any> {
		try {
			return this.messageService.findAll({filter: {conversationId: {eq: conversation.id}}});
		} catch (e) {
			return this.messageService.create({});
		}
	}

	@ResolveProperty('home')
	async getOwner(@Parent() conversation: ConversationEntity): Promise<HomeEntity> {
		try {
			return this.homeService.findOneById(conversation.homeId);
		} catch (e) {
			return this.homeService.create({});
		}
	}
}
