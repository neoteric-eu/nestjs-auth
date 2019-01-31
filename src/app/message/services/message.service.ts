import { CrudService } from '../../../base';
import { Injectable, Inject } from '@nestjs/common';
import {DateTime} from 'luxon';
import { Repository } from '../../_helpers/database/repository.interface';
import { MESSAGE_TOKEN } from '../message.constants';
import { MessageEntity } from '../entity/message.entity';
import {DeepPartial} from '../../_helpers/database';

@Injectable()
export class MessageService extends CrudService<MessageEntity> {

	constructor(@Inject(MESSAGE_TOKEN) protected readonly repository: Repository<MessageEntity>) {
		super();
	}

	public async create(data: DeepPartial<MessageEntity>): Promise<MessageEntity> {
		const entity = this.repository.create(data);
		if (!entity.createdAt) {
			entity.createdAt = DateTime.utc().toString();
		}
		return this.repository.save(entity);
	}
}
