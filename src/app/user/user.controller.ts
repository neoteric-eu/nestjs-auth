import {Controller, HttpCode, Post, UseGuards} from '@nestjs/common';
import {MessagePattern} from '@nestjs/microservices';
import {AuthGuard} from '@nestjs/passport';
import {ApiBearerAuth, ApiResponse, ApiUseTags} from '@nestjs/swagger';
import voucherCodes from 'voucher-code-generator';
import {config} from '../../config';
import {User} from '../_helpers/decorators';
import {mail, renderTemplate} from '../_helpers/mail';
import {sms} from '../_helpers/sms';
import {SMSTypeEnum} from '../_helpers/sms/SMSType.enum';
import {AppLogger} from '../app.logger';
import {createToken} from '../auth/jwt';
import {UserEntity} from './entity';
import {UserCommand} from './user.command';
import {USER_CMD_PASSWORD_NEW, USER_CMD_PASSWORD_RESET, USER_CMD_REGISTER, USER_CMD_REGISTER_VERIFY} from './user.constants';
import {UserService} from './user.service';

@Controller('user')
@ApiUseTags('user')
export class UserController {
	private logger = new AppLogger(UserController.name);

	constructor(
		protected service: UserService,
		private userCmd: UserCommand
	) {

	}

	@Post('unsubscribe/email')
	@HttpCode(204)
	@ApiResponse({ status: 204, description: 'NO CONTENT' })
	public async unsubscribeEmail(@User() user: UserEntity): Promise<void> {
		await this.service.subscription.patch(user.id.toString(), {email: false});
	}

	@Post('import')
	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'))
	public async importUsers(): Promise<any> {
		return this.userCmd.create(20);
	}

	@MessagePattern({ cmd: USER_CMD_REGISTER })
	public async onUserRegister(user: UserEntity): Promise<void> {
		try {
			this.logger.debug(`[onUserRegister] Send registration SMS for user ${user.email}`);
			const token = voucherCodes.generate({
				pattern: '######',
				charset: voucherCodes.charset('numbers')
			}).pop();
			user = await this.service.patch(user.id.toString(), {activationCode: token});
			await sms({
				sender: `AVA`,
				phoneNumber: user.phone_num,
				smsType: SMSTypeEnum.TRANSACTIONAL,
				message: `Some Message Template with ${token}`
			});
			this.logger.debug('[onUserRegister] Registration SMS sent');
		} catch (err) {
			this.logger.error(`[onUserRegister] SMS not sent, because ${err.message}`, err.stack);
		}
	}

	@MessagePattern({ cmd: USER_CMD_REGISTER_VERIFY })
	public async onUserRegisterVerify(user: UserEntity): Promise<void> {
		try {
			this.logger.debug(`[onUserRegisterVerify] Send welcome email for user ${user.email}`);
			await mail({
				subject: `Welcome ${user.first_name} to ${config.name.toUpperCase()}`,
				to: user.email,
				html: renderTemplate(`/mail/welcome.twig`, {user, config})
			});
			this.logger.debug('[onUserRegisterVerify] Welcome email sent');
		} catch (err) {
			this.logger.error(`[onUserRegisterVerify] Mail not sent, because ${err.message}`, err.stack);
		}
	}

	@MessagePattern({ cmd: USER_CMD_PASSWORD_RESET })
	public async onUserPasswordRest({ email }: {email: string}): Promise<void> {
		try {
			const user = await this.service.findOne({where: {email}});
			this.logger.debug(`[onUserRegister] Send password reset instruction email for user ${user.email}`);
			const token = createToken(user.id.toString(), config.session.password_reset.timeout, config.session.password_reset.secret);
			await mail({
				subject: `Reset your password`,
				to: user.email,
				html: renderTemplate(`/mail/password_reset.twig`, {user, config, token})
			});
			this.logger.debug('[onUserRegister] Password reset email sent');
		} catch (err) {
			this.logger.error(`[onUserRegister] Mail not sent, because ${JSON.stringify(err.message)}`, err.stack);
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
