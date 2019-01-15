import {Controller, Post, Get, Body, Headers, UseGuards, Req} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { AppLogger } from '../app.logger';
import { AuthService } from './auth.service';
import { Credentials } from './dto/credentials';

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {
	private logger = new AppLogger(AuthController.name);

	constructor(
		private readonly authService: AuthService
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
	public async fbSignIn(@Req() request: Request) {
		debugger;
	}
}
