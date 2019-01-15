import {Controller, Get} from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserEntity } from './entity';
import { RestController } from '../../base';

@ApiUseTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController extends RestController<UserEntity> {

	@Client({ transport: Transport.NATS })
	private client: ClientProxy;

	constructor(protected service: UserService) {
		super();
	}

	@Get('/test2')
	public async test2() {
		const users = this.service.findAll({});
	}
}
