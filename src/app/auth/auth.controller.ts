import {Body, Controller, Get, Headers, Post, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiImplicitBody, ApiResponse, ApiUseTags} from '@nestjs/swagger';
import {equals} from '@aws/dynamodb-expressions';
import {DeepPartial} from '../_helpers/database';
import {AppLogger} from '../app.logger';
import {UserEntity} from '../user/entity';
import {AuthService} from './auth.service';
import {CredentialsDto} from './dto/credentials.dto';
import {UserService} from '../user/user.service';
import {FacebookTokenDto} from './dto/facebook-token.dto';
import {JwtDto} from './dto/jwt.dto';
import {RefreshTokenDto} from './dto/refresh-token.dto';
import {TokenDto} from './dto/token.dto';
import {UserEntityDto} from './dto/user-entity.dto';
import {FacebookProfile} from './interfaces/facebook-profile.interface';
import {createToken, verifyToken} from './jwt';
import {Profile} from '../_helpers/decorators';
import {config} from '../../config';

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {
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
		return verifyToken(token, config.session.secret);
	}

	@Post('login')
	@ApiResponse({ status: 200, description: 'OK', type: JwtDto })
	public async login(@Body() credentials: CredentialsDto): Promise<JwtDto> {
		const user = await this.userService.login(credentials);
		return createToken(user);
	}

	@Post('register')
	@ApiImplicitBody({ required: true, type: UserEntityDto, name: 'UserEntityDto' })
	@ApiResponse({ status: 200, description: 'OK', type: JwtDto })
	public async register(@Body() data: DeepPartial<UserEntity>): Promise<JwtDto> {
		const user = await this.userService.create(data);
		return createToken(user);
	}

	@Post('refresh')
	@ApiResponse({ status: 200, description: 'OK', type: JwtDto })
	public async refreshToken(@Body() body: RefreshTokenDto): Promise<JwtDto> {
		const token = await verifyToken(body.refreshToken, config.session.refresh.secret);
		return await createToken({id: token.id});
	}

	@Post('facebook')
	@UseGuards(AuthGuard('facebook-token'))
	@ApiResponse({ status: 200, description: 'OK', type: JwtDto })
	public async fbSignIn(@Body() fbToken: FacebookTokenDto, @Profile() profile: FacebookProfile): Promise<JwtDto> {
		let user = await this.userService.findOne({filter: {...equals(profile.id), subject: 'socialId'}});
		if (!user) {
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
