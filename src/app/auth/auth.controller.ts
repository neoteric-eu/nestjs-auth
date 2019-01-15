import {Controller, Post, Get, Body, Headers, UseGuards, Req} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { AppLogger } from '../app.logger';
import { AuthService } from './auth.service';
import { Credentials } from './dto/credentials';
import {UserService} from '../user/user.service';
import {User} from '../_helpers/decorators/user.decorator';
import {FacebookProfile} from './interfaces/facebook-profile.interface';

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
		return this.authService.verifyToken(token);
	}

	@Post('token')
	public async getToken(@Body() credentials: Credentials) {
		return await this.authService.createToken(credentials);
	}

	@Post('facebook')
	@UseGuards(AuthGuard('facebook-token'))
	public async fbSignIn(@User() user: FacebookProfile) {
		// await this.userService.findOne({socialId: user.id});
		try {
			return await this.userService.socialRegister({
				email: user._json.email,
				name: user._json.name,
				socialId: user._json.id,
				provider: user.provider
			});
		} catch (e) {
			console.error(e);
			throw e;
		}
	}
}
