import {equals} from '@aws/dynamodb-expressions';
import {Controller} from '@nestjs/common';
import {MessagePattern} from '@nestjs/microservices';
import {UserService} from './user.service';
import {UserEntity} from './entity';
import {mail, renderTemplate} from '../_helpers/mail';
import {USER_CMD_PASSWORD_NEW, USER_CMD_PASSWORD_RESET, USER_CMD_REGISTER} from './user.constants';
import {config} from '../../config';
import {AppLogger} from '../app.logger';
import {createAuthToken, createToken} from '../auth/jwt';

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

	@MessagePattern({ cmd: USER_CMD_PASSWORD_RESET })
	public async onUserPasswordRest({ email }: {email: string}): Promise<void> {
		try {
			const user = await this.service.findOne({filter: {...equals(email), subject: 'email'}});
			this.logger.debug(`[onUserRegister] Send password reset instruction email for user ${user.email}`);
			const token = createToken(user.id, config.session.password_reset.timeout, config.session.password_reset.secret);
			await mail({
				subject: `Reset your password`,
				to: user.email,
				html: renderTemplate(`/mail/password_reset.twig`, {user, config, token})
			});
			this.logger.debug('[onUserRegister] Password reset email sent');
		} catch (err) {
			this.logger.error(`[onUserRegister] Mail not sent, because ${err.message}`, err.stack);
		}
	}

	@MessagePattern({ cmd: USER_CMD_PASSWORD_NEW })
	public async onUserPasswordNew(user: UserEntity): Promise<void> {
		try {
			this.logger.debug(`[onUserRegister] Send password new email for user ${user.email}`);
			await mail({
				subject: `You have a new password!`,
				to: user.email,
				html: renderTemplate(`/mail/password_new.twig`, {user, config})
			});
			this.logger.debug('[onUserRegister] Password new email sent');
		} catch (err) {
			this.logger.error(`[onUserRegister] Mail not sent, because ${err.message}`, err.stack);
		}
	}
}
