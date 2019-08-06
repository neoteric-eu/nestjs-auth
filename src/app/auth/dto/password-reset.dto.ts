import {ApiModelProperty} from '@nestjs/swagger';

export class PasswordResetDto {
	@ApiModelProperty()
	email: string;
}
