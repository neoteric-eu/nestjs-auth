import Strategy from '../_helpers/facebook/facebook-token.strategy';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {config} from '../../config';
import {AuthService} from './auth.service';

@Injectable()
export class FacebookTokenStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({
			clientID: config.facebook.app_id,
			clientSecret: config.facebook.app_secret
		});
	}

	async validate(accessToken: string, refreshToken: string, profile) {
		console.log(accessToken, refreshToken, profile);
		return profile;
	}
}
