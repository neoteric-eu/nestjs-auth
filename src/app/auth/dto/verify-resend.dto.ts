import {ApiModelProperty} from '@nestjs/swagger';

export class VerifyResendDto {
	@ApiModelProperty()
	email: string;
}
