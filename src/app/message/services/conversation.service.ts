import {CrudService} from '../../../base';
import {Inject, Injectable} from '@nestjs/common';
import {DateTime} from 'luxon';
import {DeepPartial, MongoRepository, Repository} from 'typeorm';
import {CONVERSATION_TOKEN} from '../message.constants';
import {ConversationEntity} from '../entity';

@Injectable()
export class ConversationService extends CrudService<ConversationEntity> {

	constructor(@Inject(CONVERSATION_TOKEN) protected readonly repository: MongoRepository<ConversationEntity>) {
		super();
	}
}
