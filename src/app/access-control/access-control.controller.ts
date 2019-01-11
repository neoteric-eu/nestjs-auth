import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiProduces, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ACGuard, UseRoles } from 'nest-access-control';
import { RestController } from '../../base';
import { AccessControlEntity } from './entity';
import { AccessControlService } from './access-control.service';
import { UserEntity } from '../user/entity';

@ApiUseTags('access-control')
@Controller('access-control')
@ApiResponse({status: 200, description: 'It works', type: UserEntity})
export class AccessControlController extends RestController<AccessControlEntity> {

	constructor(protected service: AccessControlService) {
		super();
	}

	@Get('/own')
	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'), ACGuard)
	@UseRoles({
		resource: 'video',
		action: 'read',
		possession: 'own'
	})
	public indexOwn(@Body() user: UserEntity) {
		return new UserEntity();
	}

	@Get('/any')
	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'), ACGuard)
	@UseRoles({
		resource: 'video',
		action: 'read',
		possession: 'any'
	})
	public indexAny() {
		return 'any';
	}
}
