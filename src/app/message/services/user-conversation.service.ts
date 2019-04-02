import {CrudService} from '../../../base';
import {Inject, Injectable} from '@nestjs/common';
import {MongoRepository} from 'typeorm';
import {USER_CONVERSATION_TOKEN} from '../message.constants';
import {UserConversationEntity} from '../entity';
import {RestVoterActionEnum} from '../../security/voter';

@Injectable()
export class UserConversationService extends CrudService<UserConversationEntity> {

	constructor(@Inject(USER_CONVERSATION_TOKEN) protected readonly repository: MongoRepository<UserConversationEntity>) {
		super();
	}

	public async softDelete(userConversation: UserConversationEntity): Promise<UserConversationEntity> {
		await this.securityService.denyAccessUnlessGranted(RestVoterActionEnum.SOFT_DELETE, userConversation);
		return userConversation.save();
	}
}
