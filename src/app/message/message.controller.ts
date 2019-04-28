import {Controller} from '@nestjs/common';
import {MessagePattern} from '@nestjs/microservices';
import {DateTime} from 'luxon';
import {AppLogger} from '../app.logger';
import {UserEntity} from '../user/entity';
import {OnlineService} from '../user/online.service';
import {MessageEntity} from './entity';
import {MessageBuffer} from './message.buffer';
import {MESSAGE_CMD_NEW, OFFLINE_MESSAGE_CMD_NEW} from './message.constants';
import {ConversationService} from './services/conversation.service';
import {MessageService} from './services/message.service';
import {UserConversationService} from './services/user-conversation.service';

@Controller()
export class MessageController {
	private logger = new AppLogger(MessageController.name);

	constructor(
		private readonly onlineService: OnlineService,
		private readonly messageBuffer: MessageBuffer,
		private readonly messageService: MessageService,
		private readonly conversationService: ConversationService,
		private readonly userConversationService: UserConversationService
	) {

	}

	@MessagePattern({cmd: MESSAGE_CMD_NEW})
	public async onMessageNew(message: MessageEntity): Promise<void> {
		this.logger.debug(`[onMessageNew] new message ${message.id}`);
		const userConversations = await this.userConversationService.findAll({
			where: {
				conversationId: {
					eq: message.conversationId
				},
				userId: {
					ne: message.authorId
				}
			}
		});
		this.logger.debug(`[onMessageNew] how manny conversation ${userConversations.length} to update`);
		for (const userConversation of userConversations) {
			this.logger.debug(`[onMessageNew] if user ${userConversation.userId} if offline, send to him notification`);
			if (this.onlineService.isOffline({id: userConversation.userId} as UserEntity)) {
				this.logger.debug(`[onMessageNew] user ${userConversation.userId} is offline`);
				this.messageBuffer.addMessage(userConversation.userId, message);
			}
			userConversation.updatedAt = DateTime.utc();
			await userConversation.save();
			await this.messageService.pubSub.publish('userConversationUpdated', {userConversationUpdated: userConversation});
		}
	}

	@MessagePattern({cmd: OFFLINE_MESSAGE_CMD_NEW})
	public whenOfflineMessageNew(message: MessageEntity) {

	}
}
