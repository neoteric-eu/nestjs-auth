import {Injectable} from '@nestjs/common';
import {AppLogger} from '../../app.logger';
import {UserConversationService} from './user-conversation.service';

@Injectable()
export class SubscriptionsService {

	private logger = new AppLogger(SubscriptionsService.name);

	constructor(private readonly userConversationService: UserConversationService) {
	}

	public async newUserConversation(payload, variables, context) {
		const found = await this.haveConversationForUser(payload.newUserConversation.conversationId, context.req.user);
		this.logger.debug(`[newUserConversation] Do we found this conversation for this user ${context.req.user.id}? ${found}`);
		return found;
	}

	public async newMessage(payload, variables, context) {
		const found = await this.haveConversationForUser(payload.newMessage.conversationId, context.req.user);
		this.logger.debug(`[newMessage] Do we found this conversation for this user ${context.req.user.id}? ${found}`);
		return found;
	}

	public async messageUpdated(payload, variables, context) {
		const found = await this.haveConversationForUser(payload.messageUpdated.conversationId, context.req.user);
		this.logger.debug(`[messageUpdated] Do we found this conversation for this user ${context.req.user.id}? ${found}`);
		return found;
	}

	public async userConversationUpdated(payload, variables, context) {
		const found = await this.haveConversationForUser(payload.userConversationUpdated.conversationId, context.req.user);
		this.logger.debug(`[userConversationUpdated] Do we found this conversation for this user ${context.req.user.id}? ${found}`);
		return found;
	}

	public async startTyping(payload, varibles, context) {
		this.logger.debug(`[startTyping]`);
		try {
			const userId = context.req.user.id.toString();
			const conversationId = payload.startTyping.conversationId;
			return this.typingLifecycle(userId, conversationId);
		} catch (e) {
			this.logger.error(e.message, e.stack);
			return false;
		}
	}

	public async stopTyping(payload, variables, context) {
		this.logger.debug(`[stopTyping]`);
		try {
			const userId = context.req.user.id.toString();
			const conversationId = payload.stopTyping.conversationId;
			return this.typingLifecycle(userId, conversationId);
		} catch (e) {
			this.logger.error(e.message, e.stack);
			return false;
		}
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

	private async typingLifecycle(userId, conversationId): Promise<boolean> {
		this.logger.debug(`[typingLifecycle] for user ${userId}`);
		this.logger.debug(`[typingLifecycle] for conversationId ${conversationId}`);
		const conversations = await this.userConversationService.findAll({where: {userId: {eq: userId}}});
		const found = conversations.some(conversation => conversation.conversationId === conversationId);
		this.logger.debug(`[typingLifecycle] Do we found conversation for this user ${userId}? ${found}`);
		return found;
	}
}
