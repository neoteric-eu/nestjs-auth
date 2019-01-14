import {IsArray, IsEmail, IsString, MinLength, Validate} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';
import {ExtendedEntity, passwordHash} from '../../_helpers';
import {IsUserAlreadyExist} from '../user.validator';

@Entity()
export class UserEntity extends ExtendedEntity {

	@ApiModelProperty()
	public id: string;

	@ApiModelProperty()
	@IsString()
	public name: string;

	@ApiModelProperty()
	@IsEmail()
	@Validate(IsUserAlreadyExist, {
		message: 'User already exists'
	})
	public email: string;

	@ApiModelProperty()
	@MinLength(7)
	public password: string;

	@ApiModelProperty()
	@IsArray()
	public roles: string[];

	hashPassword() {
		this.password = passwordHash(this.password);
	}
}
