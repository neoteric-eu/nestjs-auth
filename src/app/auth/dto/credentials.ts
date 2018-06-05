import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class Credentials {

	@ApiModelProperty()
	@IsString()
	readonly email: string;

	@ApiModelProperty()
	@IsString()
	readonly password: string;
}
