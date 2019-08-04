import {ApiModelProperty} from '@nestjs/swagger';
import {IsBoolean, IsOptional} from 'class-validator';

export class SubscriptionDto {

	@ApiModelProperty({
		required: false
	})
	@IsOptional()
	@IsBoolean()
	public email?: boolean;

	@ApiModelProperty({
		required: false
	})
	@IsOptional()
	@IsBoolean()
	public push?: boolean;

	@ApiModelProperty({
		required: false
	})
	@IsOptional()
	@IsBoolean()
	public sms?: boolean;
}
