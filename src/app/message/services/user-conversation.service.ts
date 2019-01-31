import { CrudService } from '../../../base';
import { Injectable, Inject } from '@nestjs/common';
import { DateTime } from 'luxon';
import { Repository } from '../../_helpers/database';
import { USER_CONVERSATION_TOKEN } from '../message.constants';
import { UserConversationEntity } from '../entity';

@Injectable()
export class UserConversationService extends CrudService<UserConversationEntity> {

	constructor(@Inject(USER_CONVERSATION_TOKEN) protected readonly repository: Repository<UserConversationEntity>) {
		super();
	}
}
