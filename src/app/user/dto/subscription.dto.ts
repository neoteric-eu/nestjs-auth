import {ApiModelProperty} from '@nestjs/swagger';
import {IsBoolean} from 'class-validator';

export class SubscriptionDto {

	@ApiModelProperty()
	@IsBoolean()
	public email?: boolean;

	@ApiModelProperty()
	@IsBoolean()
	public push?: boolean;

	@ApiModelProperty()
	@IsBoolean()
	public sms?: boolean;
}
