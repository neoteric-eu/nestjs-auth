import {ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';
import {UserService} from './user.service';
import {Injectable} from '@nestjs/common';

@ValidatorConstraint({ name: 'isUserAlreadyExist', async: true })
@Injectable()
export class IsUserAlreadyExist implements ValidatorConstraintInterface {
	constructor(protected readonly userService: UserService) {}

	public async validate(email: string) {
		const user = await this.userService.findByEmail(email);
		return !user;
	}
}
