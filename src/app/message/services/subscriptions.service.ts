import {Injectable} from '@nestjs/common';
import {AppLogger} from '../../app.logger';
import {UserConversationService} from './user-conversation.service';

@Injectable()
export class SubscriptionsService {

	private logger = new AppLogger(SubscriptionsService.name);

	constructor(private readonly userConversationService: UserConversationService) {
	}

	public async newUserConversation(payload, variables, context) {
		const found = this.haveConversationForUser(payload.newUserConversation.conversationId, context.req.user);
		this.logger.debug(`[newUserConversation] Do we found this conversation for this user ${context.req.user.id}? ${found}`);
		return found;
	}

	public async newMessage(payload, variables, context) {
		const found = this.haveConversationForUser(payload.newMessage.conversationId, context.req.user);
		this.logger.debug(`[newMessage] Do we found this conversation for this user ${context.req.user.id}? ${found}`);
		return found;
	}

	public async messageUpdated(payload, variables, context) {
		const found = this.haveConversationForUser(payload.messageUpdated.conversationId, context.req.user);
		this.logger.debug(`[messageUpdated] Do we found this conversation for this user ${context.req.user.id}? ${found}`);
		return found;
	}

	public userConversationUpdated(payload, variables, context) {
		const found = this.haveConversationForUser(payload.userConversationUpdated.conversationId, context.req.user);
		this.logger.debug(`[userConversationUpdated] Do we found this conversation for this user ${context.req.user.id}? ${found}`);
		return found;
	}

	private async haveConversationForUser(conversationId, user): Promise<boolean> {
		const userId = user.id.toString();
		const conversations = await this.userConversationService.findAll({
			where: {
				userId: {
					eq: userId
				}
			}
		});
		return conversations.some(conversation => conversation.conversationId === conversationId);
	}
}
