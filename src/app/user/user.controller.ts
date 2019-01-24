import {Controller} from '@nestjs/common';
import {MessagePattern} from '@nestjs/microservices';
import {UserService} from './user.service';
import {UserEntity} from './entity';
import {mail, renderTemplate} from '../_helpers/mail';
import {USER_CMD_REGISTER} from './user.constants';
import {config} from '../../config';

@Controller()
export class UserController {
	constructor(protected service: UserService) {

	}

	@MessagePattern({ cmd: USER_CMD_REGISTER })
	public async onUserRegister(user: UserEntity): Promise<void> {
		console.log(user);
		return mail({
			subject: `Welcome ${user.first_name} to ${config.name}`,
			to: user.email,
			html: await renderTemplate(`${__dirname}/misc/mail/registration.twig`, {user, config})
		});
	}
}
