import {attribute, hashKey, table} from '@aws/dynamodb-data-mapper-annotations';
import {ApiModelProperty} from '@nestjs/swagger';
import {IsBoolean, IsOptional, IsString} from 'class-validator';
import {ExtendedEntity} from '../../_helpers';

@table(`user_subscription`)
export class UserSubscriptionEntity extends ExtendedEntity {

	@ApiModelProperty()
	@hashKey()
	public id: string; // user id

	@ApiModelProperty()
	@IsBoolean()
	@IsOptional()
	@attribute()
	public email: boolean;

	@ApiModelProperty()
	@IsBoolean()
	@IsOptional()
	@attribute()
	public push = false;
}
