import {Controller} from '@nestjs/common';
import {MessagePattern} from '@nestjs/microservices';
import {DateTime} from 'luxon';
import {MESSAGE_CMD_NEW} from './message.constants';
import {MessageEntity} from './entity';
import {AppLogger} from '../app.logger';
import {ConversationService} from './services/conversation.service';
import {UserConversationService} from './services/user-conversation.service';
import {MessageService} from './services/message.service';

@Controller()
export class MessageController {
	private logger = new AppLogger(MessageController.name);

	constructor(
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
		this.logger.debug(`[onMessageNew] how manny conversation ${userConversations.length} to udpate`);
		for (const userConversation of userConversations) {
			userConversation.updatedAt = DateTime.utc();
			await userConversation.save();
			await this.messageService.pubSub.publish('userConversationUpdated', {userConversationUpdated: userConversation});
		}
	}
}
