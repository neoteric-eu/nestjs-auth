import {equals} from '@aws/dynamodb-expressions';
import {Body, Controller, Get, Headers, Post, UseGuards} from '@nestjs/common';
import {Client, ClientProxy, Transport} from '@nestjs/microservices';
import {AuthGuard} from '@nestjs/passport';
import {ApiImplicitBody, ApiResponse, ApiUseTags} from '@nestjs/swagger';
import {config} from '../../config';
import {DeepPartial} from '../_helpers/database';
import {Profile} from '../_helpers/decorators';
import {AppLogger} from '../app.logger';
import {USER_CMD_REGISTER} from '../user';
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
import {createToken, verifyToken} from './jwt';

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
	@UseGuards(AuthGuard('jwt'))
	@ApiResponse({ status: 200, description: 'OK', type: TokenDto })
	public async verify(@Headers('Authorization') token: string): Promise<TokenDto> {
		this.logger.debug(`[verify] Token ${token}`);
		return verifyToken(token, config.session.secret);
	}

	@Post('login')
	@ApiResponse({ status: 200, description: 'OK', type: JwtDto })
	public async login(@Body() credentials: CredentialsDto): Promise<JwtDto> {
		const user = await this.userService.login(credentials);
		this.logger.debug(`[login] User ${credentials.email} logging`);
		return createToken(user);
	}

	@Post('register')
	@ApiImplicitBody({ required: true, type: UserEntityDto, name: 'UserEntityDto' })
	@ApiResponse({ status: 200, description: 'OK', type: JwtDto })
	public async register(@Body() data: DeepPartial<UserEntity>): Promise<JwtDto> {
		const user = await this.userService.create(data);
		this.logger.debug(`[register] User ${data.email} register`);
		this.client.send({cmd: USER_CMD_REGISTER}, user).subscribe();
		this.logger.debug(`[register] Send registration email for email ${data.email}`);
		return createToken(user);
	}

	@Post('refresh')
	@ApiResponse({ status: 200, description: 'OK', type: JwtDto })
	public async refreshToken(@Body() body: RefreshTokenDto): Promise<JwtDto> {
		const token = await verifyToken(body.refreshToken, config.session.refresh.secret);
		this.logger.debug(`[refresh] Token ${body.refreshToken}`);
		return await createToken({id: token.id});
	}

	@Post('facebook')
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
		return createToken(user);
	}
}
