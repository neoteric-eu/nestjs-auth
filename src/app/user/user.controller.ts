import {Controller} from '@nestjs/common';
import {ApiBearerAuth, ApiUseTags} from '@nestjs/swagger';
import {UserService} from './user.service';
import {UserEntity} from './entity';
import {RestController} from '../../base';

@ApiUseTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController extends RestController<UserEntity> {

	constructor(protected service: UserService) {
		super();
	}
}
