import {Injectable} from '@nestjs/common';
import {AppLogger} from '../../app.logger';
import {RestVoterActionEnum, Voter} from '../../security';
import {UserEntity} from '../../user/entity';
import {UserConversationEntity} from '../entity';

@Injectable()
export class UserConversationVoter extends Voter {

	private logger = new AppLogger(UserConversationVoter.name);

	private readonly attributes = [
		RestVoterActionEnum.SOFT_DELETE
	];

	protected supports(attribute: any, subject: any): boolean {
		if (!this.attributes.includes(attribute)) {
			return false;
		}

		if (Array.isArray(subject)) {
			return subject.every(element => element instanceof UserConversationEntity);
		}

		return subject instanceof UserConversationEntity;
	}

	protected async voteOnAttribute(attribute: string, subject: UserConversationEntity | UserConversationEntity[], token): Promise<boolean> {
		const user = token.getUser();

		if (!(user instanceof UserEntity)) {
			return false;
		}

		switch (attribute) {
			case RestVoterActionEnum.SOFT_DELETE:
				return this.canSoftDelete(subject as UserConversationEntity, user);
			default:
				return false;
		}
	}

	private async canSoftDelete(userConversation: UserConversationEntity, user: UserEntity): Promise<boolean> {
		this.logger.debug(`[canSoftDelete[ only conversation owner can soft delete it`);
		const userId = user.id.toString();
		return userConversation.userId === userId;
	}
}
