import {Controller} from '@nestjs/common';
import {MessagePattern} from '@nestjs/microservices';
import {UserService} from './user.service';
import {UserEntity} from './entity';
import {mail, renderTemplate} from '../_helpers/mail';
import {USER_CMD_REGISTER} from './user.constants';
import {config} from '../../config';
import {AppLogger} from '../app.logger';

@Controller()
export class UserController {
	private logger = new AppLogger(UserController.name);

	constructor(protected service: UserService) {

	}

	@MessagePattern({ cmd: USER_CMD_REGISTER })
	public async onUserRegister(user: UserEntity): Promise<void> {
		this.logger.debug(`[onUserRegister] Send registration email for user ${user.email}`);
		return mail({
			subject: `Welcome ${user.first_name} to ${config.name}`,
			to: user.email,
			html: await renderTemplate(`${__dirname}/misc/mail/registration.twig`, {user, config})
		});
	}
}
