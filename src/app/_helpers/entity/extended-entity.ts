import {attribute} from '@aws/dynamodb-data-mapper-annotations';
import {ApiModelProperty} from '@nestjs/swagger';

export class ExtendedEntity {
	public id?: string;

	@ApiModelProperty()
	@attribute()
	public createdAt: string;

	@ApiModelProperty()
	@attribute()
	public updatedAt: string;
}
