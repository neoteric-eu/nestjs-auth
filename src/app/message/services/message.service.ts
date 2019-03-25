import {CrudService} from '../../../base';
import {Inject, Injectable} from '@nestjs/common';
import {DateTime} from 'luxon';
import {MESSAGE_TOKEN} from '../message.constants';
import {MessageEntity} from '../entity';
import {DeepPartial} from '../../_helpers/database';
import {MongoRepository, Repository} from 'typeorm';

@Injectable()
export class MessageService extends CrudService<MessageEntity> {

	constructor(@Inject(MESSAGE_TOKEN) protected readonly repository: MongoRepository<MessageEntity>) {
		super();
	}
}
