import {Injectable} from '@nestjs/common';
import {AppLogger} from '../../app.logger';
import {UserConversationService} from './user-conversation.service';
import {SecurityService} from '../../security/security.service';
import {MESSAGE_VOTER_ACTION_RECEIVE} from '../message.constants';

@Injectable()
export class SubscriptionsService {

	private logger = new AppLogger(SubscriptionsService.name);

	constructor(
		private readonly userConversationService: UserConversationService,
		private readonly securityService: SecurityService
	) {
	}

	public async newUserConversation(payload, variables, context) {
		const user = context.req.user;
		const conversations = await this.userConversationService.findAll({ filter: { userId: {eq: user.id }}});
		return conversations.some(conversation => conversation.conversationId === payload.newUserConversation.conversationId);
	}

	public async newMessage(payload, variables, context) {
		const user = context.req.user;
		if (payload.newMessage.conversationId !== variables.conversationId) {
			this.logger.debug(`[newMessage] different conversationId for listening`);
			return false;
		}
		const conversations = await this.userConversationService.findAll({ filter: { userId: { eq: user.id }}});
		const found = conversations.some(conversation => conversation.conversationId === variables.conversationId);
		this.logger.debug(`[newMessage] Do we found this conversation for this user? ${found}`);
		return found;
	}
}
