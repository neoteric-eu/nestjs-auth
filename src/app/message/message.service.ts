import { CrudService } from '../../base';
import { Injectable, Inject } from '@nestjs/common';
import { Repository } from '../_helpers/database/repository.interface';
import { MESSAGE_TOKEN } from './message.constants';
import { MessageEntity } from './entity/message.entity';

@Injectable()
export class MessageService extends CrudService<MessageEntity> {

	constructor(@Inject(MESSAGE_TOKEN) protected readonly repository: Repository<MessageEntity>) {
		super();
	}
}
