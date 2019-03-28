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
		const conversations = await this.userConversationService.findAll({where: {userId: {eq: user.id.toString()}}});
		return conversations.some(conversation => conversation.conversationId === payload.newUserConversation.conversationId);
	}

	public async newMessage(payload, variables, context) {
		const user = context.req.user;
		const conversationId = payload.newMessage.conversationId;
		const conversations = await this.userConversationService.findAll({where: {userId: {eq: user.id.toString()}}});
		const found = conversations.some(conversation => conversation.conversationId === conversationId);
		this.logger.debug(`[newMessage] Do we found this conversation for this user ${user.id}? ${found}`);
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

	private async typingLifecycle(userId, conversationId): Promise<boolean> {
		this.logger.debug(`[typingLifecycle] for user ${userId}`);
		this.logger.debug(`[typingLifecycle] for conversationId ${conversationId}`);
		const conversations = await this.userConversationService.findAll({where: {userId: {eq: userId}}});
		const found = conversations.some(conversation => conversation.conversationId === conversationId);
		this.logger.debug(`[typingLifecycle] Do we found conversation for this user ${userId}? ${found}`);
		return found;
	}
}
