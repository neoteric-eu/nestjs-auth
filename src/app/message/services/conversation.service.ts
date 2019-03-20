import {CrudService} from '../../../base';
import {Inject, Injectable} from '@nestjs/common';
import {DateTime} from 'luxon';
import {DeepPartial, Repository} from 'typeorm';
import {CONVERSATION_TOKEN} from '../message.constants';
import {ConversationEntity} from '../entity';

@Injectable()
export class ConversationService extends CrudService<ConversationEntity> {

	constructor(@Inject(CONVERSATION_TOKEN) protected readonly repository: Repository<ConversationEntity>) {
		super();
	}

	public async create(data: DeepPartial<ConversationEntity>): Promise<ConversationEntity> {
		const entity = this.repository.create(data);
		if (!entity.createdAt) {
			entity.createdAt = DateTime.utc().toString();
		}
		return this.repository.save(entity);
	}
}
