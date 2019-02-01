import {attribute, hashKey, table} from '@aws/dynamodb-data-mapper-annotations';
import {ApiModelProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';
import {ExtendedEntity} from '../../_helpers';

@table(`user_email`)
export class UserEmailEntity extends ExtendedEntity {

	@ApiModelProperty()
	@hashKey()
	public id: string; // user email

	@ApiModelProperty()
	@IsString()
	@attribute()
	public user_id: string;
}
