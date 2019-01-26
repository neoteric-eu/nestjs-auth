import {ApiModelProperty} from '@nestjs/swagger';
import {IsEmail, IsOptional, IsString, IsUrl, MinLength} from 'class-validator';

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
	@IsOptional()
	@IsString()
	public phone_num: string;

	@ApiModelProperty()
	@IsOptional()
	@IsUrl()
	public profile_img: string;
}
