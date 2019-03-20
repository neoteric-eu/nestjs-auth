import {CrudService} from '../../../base';
import {Inject, Injectable} from '@nestjs/common';
import {DateTime} from 'luxon';
import {MESSAGE_TOKEN} from '../message.constants';
import {MessageEntity} from '../entity';
import {DeepPartial} from '../../_helpers/database';
import {Repository} from 'typeorm';

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
