import {equals} from '@aws/dynamodb-expressions';
import {Body, Controller, Get, Headers, HttpCode, Post, UseGuards} from '@nestjs/common';
import {Client, ClientProxy, Transport} from '@nestjs/microservices';
import {AuthGuard} from '@nestjs/passport';
import {ApiImplicitBody, ApiResponse, ApiUseTags} from '@nestjs/swagger';
import {config} from '../../config';
import {DeepPartial} from '../_helpers/database';
import {Profile} from '../_helpers/decorators';
import {AppLogger} from '../app.logger';
import {USER_CMD_PASSWORD_NEW, USER_CMD_PASSWORD_RESET, USER_CMD_REGISTER} from '../user';
import {UserEntity} from '../user/entity';
import {UserService} from '../user/user.service';
import {AuthService} from './auth.service';
import {CredentialsDto} from './dto/credentials.dto';
import {FacebookTokenDto} from './dto/facebook-token.dto';
import {JwtDto} from './dto/jwt.dto';
import {RefreshTokenDto} from './dto/refresh-token.dto';
import {TokenDto} from './dto/token.dto';
import {UserEntityDto} from './dto/user-entity.dto';
import {FacebookProfile} from './interfaces/facebook-profile.interface';
import {createAuthToken, verifyToken} from './jwt';
import {PasswordResetDto} from './dto/password-reset.dto';
import {PasswordTokenDto} from './dto/password-token.dto';

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {

	@Client({ transport: Transport.TCP })
	private client: ClientProxy;

	private logger = new AppLogger(AuthController.name);

	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService
	) {

	}

	@Get('verify')
	@HttpCode(200)
	@UseGuards(AuthGuard('jwt'))
	@ApiResponse({ status: 200, description: 'OK', type: TokenDto })
	public async verify(@Headers('Authorization') token: string): Promise<TokenDto> {
		this.logger.debug(`[verify] Token ${token}`);
		return verifyToken(token, config.session.secret);
	}

	@Post('login')
	@HttpCode(200)
	@ApiResponse({ status: 200, description: 'OK', type: JwtDto })
	public async login(@Body() credentials: CredentialsDto): Promise<JwtDto> {
		const user = await this.userService.login(credentials);
		this.logger.debug(`[login] User ${credentials.email} logging`);
		return createAuthToken(user);
	}

	@Post('register')
	@HttpCode(201)
	@ApiImplicitBody({ required: true, type: UserEntityDto, name: 'UserEntityDto' })
	@ApiResponse({ status: 201, description: 'CREATED', type: JwtDto })
	public async register(@Body() data: DeepPartial<UserEntity>): Promise<JwtDto> {
		const user = await this.userService.create(data);
		this.logger.debug(`[register] User ${data.email} register`);
		this.client.send({cmd: USER_CMD_REGISTER}, user).subscribe();
		this.logger.debug(`[register] Send registration email for email ${data.email}`);
		return createAuthToken(user);
	}

	@Post('password/reset')
	@HttpCode(204)
	@ApiImplicitBody({ required: true, type: PasswordResetDto, name: 'PasswordResetDto' })
	@ApiResponse({ status: 204, description: 'NO CONTENT' })
	public passwordReset(@Body() data: DeepPartial<UserEntity>): void {
		this.logger.debug(`[passwordReset] User ${data.email} starts password reset`);
		this.client.send({cmd: USER_CMD_PASSWORD_RESET}, {email: data.email}).subscribe();
	}

	@Post('password/new')
	@HttpCode(204)
	@ApiImplicitBody({ required: true, type: PasswordTokenDto, name: 'PasswordTokenDto' })
	@ApiResponse({ status: 204, description: 'NO CONTENT' })
	public async passwordNew(@Body() body: PasswordTokenDto): Promise<void> {
		this.logger.debug(`[passwordNew] Token ${body.resetToken}`);
		const token = await verifyToken(body.resetToken, config.session.password_reset.secret);
		const user = await this.userService.update({id: token.id, password: body.password});
		this.logger.debug(`[passwordNew] Send change password email for user ${user.email}`);
		this.client.send({cmd: USER_CMD_PASSWORD_NEW}, user).subscribe();
	}

	@Post('refresh')
	@HttpCode(200)
	@ApiResponse({ status: 200, description: 'OK', type: JwtDto })
	public async refreshToken(@Body() body: RefreshTokenDto): Promise<JwtDto> {
		this.logger.debug(`[refresh] Token ${body.refreshToken}`);
		const token = await verifyToken(body.refreshToken, config.session.refresh.secret);
		return await createAuthToken({id: token.id});
	}

	@Post('facebook')
	@HttpCode(200)
	@UseGuards(AuthGuard('facebook-token'))
	@ApiResponse({ status: 200, description: 'OK', type: JwtDto })
	public async fbSignIn(@Body() fbToken: FacebookTokenDto, @Profile() profile: FacebookProfile): Promise<JwtDto> {
		this.logger.debug(`[fbSignIn] Facebook socialId ${profile.id}`);
		let user = await this.userService.findOne({filter: {...equals(profile.id), subject: 'socialId'}});
		if (!user) {
			this.logger.debug(`[fbSignIn] User with this id doesn't exists before, social register`);
			user = await this.userService.socialRegister({
				email: profile._json.email,
				first_name: profile._json.first_name,
				last_name: profile._json.last_name,
				socialId: profile._json.id,
				provider: profile.provider
			});
		}
		return createAuthToken(user);
	}
}
