import {ApiModelProperty} from '@nestjs/swagger';
import {IsEmail, IsString, MinLength} from 'class-validator';

export class UserEntityDto {
	@ApiModelProperty()
	@IsString()
	public first_name: string;

	@ApiModelProperty()
	@IsString()
	public last_name: string;

	@ApiModelProperty()
	@IsEmail()
	public email: string;

	@ApiModelProperty()
	@MinLength(7)
	public password: string;

	@ApiModelProperty()
	@IsString()
	public phone_num: string;
}
