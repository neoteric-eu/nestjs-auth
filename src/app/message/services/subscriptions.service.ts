import {Injectable} from '@nestjs/common';
import {AppLogger} from '../../app.logger';
import {UserConversationService} from './user-conversation.service';

@Injectable()
export class SubscriptionsService {

	private logger = new AppLogger(SubscriptionsService.name);

	constructor(private readonly userConversationService: UserConversationService) {
	}

	public async newUserConversation(payload, variables, context) {
		const user = context.req.user;
		const conversations = await this.userConversationService.findAll({filter: {userId: {eq: user.id}}});
		return conversations.some(conversation => conversation.conversationId === payload.newUserConversation.conversationId);
	}

	public async newMessage(payload, variables, context) {
		const user = context.req.user;
		const conversationId = payload.newMessage.conversationId;
		const conversations = await this.userConversationService.findAll({filter: {userId: {eq: user.id}}});
		const found = conversations.some(conversation => conversation.conversationId === conversationId);
		this.logger.debug(`[newMessage] Do we found this conversation for this user ${user.id}? ${found}`);
		return found;
	}
}
