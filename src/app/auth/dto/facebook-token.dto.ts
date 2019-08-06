import {ApiModelProperty} from '@nestjs/swagger';

export class FacebookTokenDto {
	@ApiModelProperty()
	access_token: string;
}
