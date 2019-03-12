import {ApiModelProperty} from '@nestjs/swagger';

export class VerifyTokenDto {
	@ApiModelProperty()
	verifyToken: string;

	@ApiModelProperty()
	email: string;
}
