import {Controller, Get, UseGuards} from '@nestjs/common';
import {AppLogger} from '../app.logger';
import {ApiBearerAuth, ApiUseTags} from '@nestjs/swagger';
import {AuthGuard} from '@nestjs/passport';
import {ACGuard, UseRoles} from 'nest-access-control';
import {RestController} from '../../base';
import {AccessControlEntity} from './entity';
import {AccessControlService} from './access-control.service';

@ApiUseTags('access-control')
@Controller('access-control')
export class AccessControlController extends RestController<AccessControlEntity> {
	private logger = new AppLogger(AccessControlController.name);

	constructor(protected service: AccessControlService) {
		super();
	}

	@Get('/own')
	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'), ACGuard)
	@UseRoles({
		resource:  'video',
		action:  'read',
		possession:  'own'
	})
	public indexOwn() {
		return 'own';
	}

	@Get('/any')
	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'), ACGuard)
	@UseRoles({
		resource:  'video',
		action:  'read',
		possession:  'any'
	})
	public indexAny() {
		return 'any';
	}
}
