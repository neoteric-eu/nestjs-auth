import {ApiModelProperty} from '@nestjs/swagger';

export class JwtDto {
	@ApiModelProperty()
	expiresIn: number;

	@ApiModelProperty()
	accessToken: string;

	@ApiModelProperty()
	refreshToken: string;
}
