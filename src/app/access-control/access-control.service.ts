import { Repository } from 'typeorm';
import { CrudService } from '../../base';
import { Injectable, Inject } from '@nestjs/common';
import { ACCESS_CONTROL_TOKEN } from './access-control.constants';
import { AccessControlEntity } from './entity';
import { ROLES_BUILDER_TOKEN } from 'nest-access-control/constants';
import { RolesBuilder } from 'nest-access-control';

@Injectable()
export class AccessControlService extends CrudService<AccessControlEntity> {
	protected resource = 'video';

	constructor(
		@Inject(ACCESS_CONTROL_TOKEN) protected readonly repository: Repository<AccessControlEntity>,
		@Inject(ROLES_BUILDER_TOKEN) private readonly rolesBuilder: RolesBuilder
	) {
		super();
	}

	public async findAll({user}): Promise<AccessControlEntity[]> {
		if (this.rolesBuilder.can(user.roles).readAny(this.resource) ) {
		}
		return await this.repository.find();
	}
}
