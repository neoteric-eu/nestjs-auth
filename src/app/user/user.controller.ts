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
		try {
			this.logger.debug(`[onUserRegister] Send registration email for user ${user.email}`);
			await mail({
				subject: `Welcome ${user.first_name} to ${config.name}`,
				to: user.email,
				html: renderTemplate(`/mail/registration.twig`, {user, config})
			});
			this.logger.debug('[onUserRegister] Registration email sent');
		} catch (err) {
			this.logger.error(`[onUserRegister] Mail not sent, because ${err.message}`, err.stack);
		}
	}
}
