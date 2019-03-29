import {Injectable} from '@nestjs/common';
import {AppLogger} from '../../app.logger';
import {RestVoterActionEnum, Voter} from '../../security';
import {UserEntity} from '../../user/entity';
import {MessageEntity} from '../entity';
import {UserConversationService} from '../services/user-conversation.service';

@Injectable()
export class MessageVoter extends Voter {

	private logger = new AppLogger(MessageVoter.name);

	private readonly attributes = [
		RestVoterActionEnum.READ_ALL,
		RestVoterActionEnum.CREATE,
		RestVoterActionEnum.UPDATE
	];

	constructor(private readonly userConversationService: UserConversationService) {
		super();
	}

	protected supports(attribute: any, subject: any): boolean {
		if (!this.attributes.includes(attribute)) {
			return false;
		}

		if (Array.isArray(subject)) {
			return subject.every(element => element instanceof MessageEntity);
		}

		return subject instanceof MessageEntity;
	}

	protected async voteOnAttribute(attribute: string, subject: MessageEntity | MessageEntity[], token): Promise<boolean> {
		const user = token.getUser();

		if (!(user instanceof UserEntity)) {
			return false;
		}

		switch (attribute) {
			case RestVoterActionEnum.READ_ALL:
				return this.canReadAll(subject as MessageEntity[], user);
			case RestVoterActionEnum.CREATE:
				return this.canCreate(subject as MessageEntity, user);
			case RestVoterActionEnum.UPDATE:
				return this.canUpdate(subject as MessageEntity, user);
			case RestVoterActionEnum.SOFT_DELETE:
				return this.canSoftDelete(subject as MessageEntity, user);
		}

		return Promise.resolve(false);
	}

	private async canReadAll(messages: MessageEntity[], user: UserEntity): Promise<boolean> {
		const message = messages[0];
		const userConversations = await this.userConversationService.findAll({where: {userId: {eq: user.id.toString()}}});
		return userConversations.some(userConversation => message.conversationId === userConversation.conversationId);
	}

	private async canCreate(message: MessageEntity, user: UserEntity): Promise<boolean> {
		this.logger.debug(`[canCreate[ everyone can create message but only in their conversations`);
		const userConversation = await this.userConversationService.findOne({
			where: {
				userId: {eq: user.id.toString()},
				conversationId: {eq: message.conversationId}
			}
		});
		return !!userConversation;
	}

	private async canUpdate(message: MessageEntity, user: UserEntity): Promise<boolean> {
		this.logger.debug(`[canUpdate[ only owner of message can update it`);
		return message.authorId === user.id.toString();
	}

	private async canSoftDelete(message: MessageEntity, user: UserEntity): Promise<boolean> {
		this.logger.debug(`[canSoftDelete[ only conversation collaborators can soft delete it`);
		const userId = user.id.toString();
		const userConversations = await this.userConversationService.findAll({where: {conversationId: {eq: message.conversationId}}});
		return userConversations.some(userConversation => userConversation.userId === userId);
	}
}
