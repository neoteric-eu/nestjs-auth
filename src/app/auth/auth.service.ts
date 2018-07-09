import * as jwt from 'jsonwebtoken';
import {Injectable, forwardRef, Inject} from '@nestjs/common';
import {config} from '../../config';
import {UserService} from '../user/user.service';
import {Credentials} from './dto/credentials';
import {JwtPayload} from './interfaces/jwt-payload.inteface';

@Injectable()
export class AuthService {
	constructor(@Inject(forwardRef(() => UserService)) private readonly userService: UserService) {}

	async createToken(credentials: Credentials) {
		const user = await this.userService.login(credentials);
		const expiresIn = 60 * 60;
		const accessToken = jwt.sign({id: user.id}, config.session.secret, {
			expiresIn,
			audience: config.session.domain,
			issuer: config.uuid
		});
		return {
			expiresIn,
			accessToken
		};
	}

	async verifyToken(token: string) {

		return new Promise(resolve => {
			jwt.verify(token, config.session.secret, decoded => resolve(decoded));
		});
	}

	async validateUser(payload: JwtPayload): Promise<any> {
		return await this.userService.findOneById(payload.id);
	}
}
