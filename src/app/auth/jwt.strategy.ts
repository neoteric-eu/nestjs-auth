import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {config} from '../../config';
import {AuthService} from './auth.service';
import {JwtPayload} from './interfaces/jwt-payload.inteface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.session.secret,
			issuer: config.uuid,
			audience: config.session.domain
		});
	}

	async validate(payload: JwtPayload) {
		const user = await this.authService.validateUser(payload);
		if (!user) {
			throw new UnauthorizedException();
		}
		return user;
	}
}
