import {ApiModelProperty} from '@nestjs/swagger';
import {config} from '../../../config';

export class UserEntityDto {
	@ApiModelProperty()
	public first_name: string;

	@ApiModelProperty()
	public last_name: string;

	@ApiModelProperty()
	public email: string;

	@ApiModelProperty({
		minLength: config.passwordMinLength
	})
	public password: string;

	@ApiModelProperty()
	public phone_num: string;

	@ApiModelProperty({
		required: false
	})
	public profile_img?: string;
}
