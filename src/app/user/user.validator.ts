import {equals} from '@aws/dynamodb-expressions';
import {ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';
import {UserService} from './user.service';
import {Injectable} from '@nestjs/common';

@ValidatorConstraint({ name: 'isUserAlreadyExist', async: true })
@Injectable()
export class IsUserAlreadyExist implements ValidatorConstraintInterface {
	constructor(protected readonly userService: UserService) {}

	public async validate(text: string) {
		const user = await this.userService.findOne(({filter: {...equals(text), subject: 'email'}}));
		return !user;
	}
}
