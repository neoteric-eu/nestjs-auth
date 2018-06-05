import {Repository} from 'typeorm';
import {CrudService} from '../../base';
import {Injectable, Inject} from '@nestjs/common';
import {ACCESS_CONTROL_TOKEN} from './access-control.constants';
import {AccessControlEntity} from './entity';

@Injectable()
export class AccessControlService extends CrudService<AccessControlEntity> {

	constructor(@Inject(ACCESS_CONTROL_TOKEN) protected readonly repository: Repository<AccessControlEntity>) {
		super();
	}
}
