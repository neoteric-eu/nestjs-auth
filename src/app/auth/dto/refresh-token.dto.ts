import {ApiModelProperty} from '@nestjs/swagger';

export class RefreshTokenDto {
	@ApiModelProperty()
	refreshToken: string;
}
