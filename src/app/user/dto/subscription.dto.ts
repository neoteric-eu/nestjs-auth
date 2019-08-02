import {ApiModelProperty} from '@nestjs/swagger';
import {IsBoolean, IsOptional} from 'class-validator';

export class SubscriptionDto {

	@ApiModelProperty()
	@IsOptional()
	@IsBoolean()
	public email?: boolean;

	@ApiModelProperty()
	@IsOptional()
	@IsBoolean()
	public push?: boolean;

	@ApiModelProperty()
	@IsOptional()
	@IsBoolean()
	public sms?: boolean;
}
