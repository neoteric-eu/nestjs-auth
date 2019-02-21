import {attribute, hashKey, table} from '@aws/dynamodb-data-mapper-annotations';
import {ApiModelProperty} from '@nestjs/swagger';
import {ExtendedEntity} from '../../_helpers';

@table(`social`)
export class SocialEntity extends ExtendedEntity {

	@ApiModelProperty()
	@hashKey()
	public id: string;

	@ApiModelProperty()
	@attribute()
	public userId: string;

	@ApiModelProperty()
	@attribute()
	public cratedAt: string;

	@ApiModelProperty()
	@attribute()
	public updatedAt: string;
}
