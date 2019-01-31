import {ApiModelProperty} from '@nestjs/swagger';
import {IsEmail, IsOptional, IsString, IsUrl, MinLength} from 'class-validator';

export class UserEntityDto {
	@ApiModelProperty()
	public first_name: string;

	@ApiModelProperty()
	public last_name: string;

	@ApiModelProperty()
	public email: string;

	@ApiModelProperty()
	public password: string;

	@ApiModelProperty()
	public phone_num: string;

	@ApiModelProperty()
	public profile_img: string;
}
