import {Injectable, OnModuleInit} from '@nestjs/common';
import {config} from '../../config';
import {mail, renderTemplate} from '../_helpers/mail';
import {push} from '../_helpers/push';
import {AppLogger} from '../app.logger';
import {UserService} from '../user/user.service';
import {MessageEntity} from './entity';
import {MessageBuffer} from './message.buffer';

@Injectable()
export class MessageCron implements OnModuleInit {
	private logger = new AppLogger(MessageCron.name);

	constructor(
		private readonly messageBuffer: MessageBuffer,
		private readonly userService: UserService
	) {

	}

	public onModuleInit(): void {
		setInterval(() => this.collectMessages(), 60000);
	}

	private async collectMessages() {
		this.logger.silly(`[collectMessages] start`);
		for (const [userId, messages] of this.messageBuffer.getEntries()) {
			this.logger.silly(`[collectMessages] for ${userId} we have ${messages.size} to send`);
			if (messages.size) {
				await this.sendNotification(userId, messages);
				this.messageBuffer.flush(userId);
			}
		}
		this.logger.silly(`[collectMessages] end`);
	}

	private async sendNotification(userId: string, messages: Set<MessageEntity>) {
		const subscription = await this.userService.subscription.findOne({where: {user: {eq: userId}}});
		if (!subscription || !subscription.push || !subscription.email) {
			return;
		}
		const user = await this.userService.findOneById(userId);
		if (subscription.email) {
			await mail({
				subject: `You've got new ${messages.size > 1 ? 'messages' : 'message'} when you was offline`,
				to: user.email,
				html: renderTemplate(`/mail/message_new.twig`, {user, config, messages: Array.from(messages)})
			});
		}

		if (subscription.push) {
			await push(user.phone_token, {
				data: { messages } as any,
				notification: {
					title: `You've got new ${messages.size > 1 ? 'messages' : 'message'}`,
					badge: '1'
				}
			});
		}
	}
}
