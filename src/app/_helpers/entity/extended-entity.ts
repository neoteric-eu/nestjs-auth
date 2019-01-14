import {ApiModelProperty} from '@nestjs/swagger';
import {DynamoColumn} from '../aws/dynamo-column.decorator';

export class ExtendedEntity {

	@ApiModelProperty()
	public uuid: string;

	@ApiModelProperty()
	public version: number;

	@ApiModelProperty()
	public cratedAt: Date;

	@ApiModelProperty()
	@DynamoColumn({
		type: 'S'
	})
	public updatedAt: Date;

	toString() {
		return '';
	}

	toDynamoDB(): any {
		const metadata = Reflect.getOwnMetadataKeys(this);

	}
}
