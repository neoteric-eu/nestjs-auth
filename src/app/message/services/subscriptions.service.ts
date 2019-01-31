import {Injectable} from '@nestjs/common';
import {AppLogger} from '../../app.logger';
import {UserConversationService} from './user-conversation.service';

@Injectable()
export class SubscriptionsService {

	private logger = new AppLogger(SubscriptionsService.name);

	constructor(private readonly userConversationService: UserConversationService) {
	}

	public newUserConversation(payload, variables, context) {
		const user = context.req.user;
		if (payload.newUserConversation.userId !== variables.userId) {
			this.logger.debug(`[newConversation] different userId for listening`);
			return false;
		}
		return variables.userId === user.id;
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
