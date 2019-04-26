import {Inject, Injectable} from '@nestjs/common';
import {MongoRepository} from 'typeorm';
import {CrudService} from '../../base';
import {CONTRACT_TOKEN} from './contract.constants';
import {ContractEntity} from './entity';

@Injectable()
export class ContractService extends CrudService<ContractEntity> {

	constructor(@Inject(CONTRACT_TOKEN) protected readonly repository: MongoRepository<ContractEntity>) {
		super();
	}
}
