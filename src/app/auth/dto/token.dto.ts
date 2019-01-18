import {ApiModelProperty} from '@nestjs/swagger';

export class TokenDto {
	@ApiModelProperty()
	id: string;

	@ApiModelProperty()
	expiresIn: number;

	@ApiModelProperty()
	audience: string;

	@ApiModelProperty()
	issuer: string;
}
