import {Injectable} from '@nestjs/common';
import {UserService} from '../user/user.service';
import {JwtPayload} from './interfaces/jwt-payload.inteface';

@Injectable()
export class AuthService {
	constructor(private readonly userService: UserService) {}

	async validateUser(payload: JwtPayload): Promise<any> {
		return await this.userService.findOneById(payload.id);
	}
}
