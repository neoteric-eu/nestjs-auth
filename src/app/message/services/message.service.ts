import {Inject, Injectable} from '@nestjs/common';
import {MongoRepository} from 'typeorm';
import {CrudService} from '../../../base';
import {RestVoterActionEnum} from '../../security/voter';
import {MessageEntity} from '../entity';
import {MESSAGE_TOKEN} from '../message.constants';

@Injectable()
export class MessageService extends CrudService<MessageEntity> {

	public pubSub;

	constructor(@Inject(MESSAGE_TOKEN) protected readonly repository: MongoRepository<MessageEntity>) {
		super();
	}

	public async softDelete(message: MessageEntity): Promise<MessageEntity> {
		await this.securityService.denyAccessUnlessGranted(RestVoterActionEnum.SOFT_DELETE, message);
		return message.save();
	}
}
