import {Body, Controller, Get, Headers, Post, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiBearerAuth, ApiUseTags} from '@nestjs/swagger';
import {AppLogger} from '../app.logger';
import {AuthService} from './auth.service';
import {Credentials} from './dto/credentials';
import {UserService} from '../user/user.service';
import {FacebookProfile} from './interfaces/facebook-profile.interface';
import {createToken, verifyToken} from './jwt';
import {Profile} from '../_helpers/decorators';

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {
	private logger = new AppLogger(AuthController.name);

	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService
	) {
		this.logger.log('hello from the other side');
	}

	@Get('verify')
	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'))
	public async verify(@Headers('Authorization') token: string) {
		return verifyToken(token);
	}

	@Post('token')
	public async getToken(@Body() credentials: Credentials) {
		const user = await this.userService.login(credentials);
		return await createToken(user);
	}

	@Post('facebook')
	@UseGuards(AuthGuard('facebook-token'))
	public async fbSignIn(@Profile() profile: FacebookProfile) {
		try {
			return this.userService.findOne({socialId: profile.id})
				.subscribe(user => createToken(user));
		} catch (e) {
			console.error(e);
			return await this.userService.socialRegister({
				email: profile._json.email,
				name: profile._json.name,
				socialId: profile._json.id,
				provider: profile.provider
			});
		}
	}
}
