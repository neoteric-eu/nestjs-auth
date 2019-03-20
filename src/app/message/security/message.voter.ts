import {Injectable} from '@nestjs/common';
import {RestVoterActionEnum, Voter, VoterRegistry} from '../../security';
import {MessageEntity} from '../entity';
import {UserEntity} from '../../user/entity';
import {MESSAGE_VOTER_ACTION_RECEIVE} from '../message.constants';
import {UserConversationService} from '../services/user-conversation.service';
import {ConversationService} from '../services/conversation.service';
import {AppLogger} from '../../app.logger';

@Injectable()
export class MessageVoter extends Voter {

	private logger = new AppLogger(MessageVoter.name);

	private readonly attributes = [
		RestVoterActionEnum.READ_ALL,
		RestVoterActionEnum.CREATE
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
		}

		return Promise.resolve(false);
	}

	private async canReadAll(messages: MessageEntity[], user: UserEntity): Promise<boolean> {
		const message = messages[0];
		const userConversations = await this.userConversationService.findAll({where: {userId: user.id}});
		return userConversations.some(userConversation => message.conversationId === userConversation.conversationId);
	}

	private canCreate(message: MessageEntity, user: UserEntity) {
		return true;
	}
}
