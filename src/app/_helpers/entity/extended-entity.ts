import {ApiModelProperty} from '@nestjs/swagger';
import {DYNAMO_COLUMN_DEF, DynamoColumn} from '../aws/dynamo-column.decorator';

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
		const metadataKeys = Reflect.getMetadata(DYNAMO_COLUMN_DEF, this);
		const item = {};
		for (const key in metadataKeys) {
			if (!metadataKeys.hasOwnProperty(key)) {
				continue;
			}
			const val = metadataKeys[key];
			item[key] = {};
			item[key][val.type] = this[key];
		}
		return {
			TableName: this.constructor.name,
			Item: item
		};
	}
}
