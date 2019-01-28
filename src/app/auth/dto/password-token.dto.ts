import {ApiModelProperty} from '@nestjs/swagger';

export class PasswordTokenDto {
	@ApiModelProperty()
	resetToken: string;

	@ApiModelProperty()
	password: string;
}
