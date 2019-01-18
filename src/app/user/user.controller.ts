import {Controller} from '@nestjs/common';
import {Client, ClientProxy, Transport} from '@nestjs/microservices';
import {UserService} from './user.service';

@Controller()
export class UserController {

	@Client({ transport: Transport.NATS })
	private client: ClientProxy;

	constructor(protected service: UserService) {
	}
}
