import {Repository} from '../database/repository.interface';
import {ExtendedEntity} from '../entity/extended-entity';
import AWS from 'aws-sdk';
import {plainToClass} from 'class-transformer';
import {DeepPartial} from '../database/deep-partial';


export class DynamoRepository<T extends ExtendedEntity> implements Repository<T> {

	constructor(private dynamo: AWS.DynamoDB, private entity: new () => T) {

	}

	public create(data: DeepPartial<T>): T {
		return plainToClass<T, DeepPartial<T>>(this.entity, data);
	}

	public async save(model: T): Promise<T> {
		await this.dynamo.putItem(model.toDynamoDB()).promise();
		return model;
	}

	public async delete(): Promise<T> {
		return {} as any;
	}

	public async find(): Promise<T[]> {
		return Promise.resolve({}) as any;
		/*const params = { RequestItems : {} };
		params.RequestItems[this.entity.constructor.name] = {};
		return this.dynamo.batchGetItem(params)
			.promise()
			.then(respose => {
				const items = [];
				for (const node of respose) {
					items.push({
						...Object.keys(node)
					});
				}
				return plainToClass(this.entity, items);
			});*/
	}

	public async findOne(): Promise<T> {
		return Promise.resolve({}) as any;
	}

	public async findOneOrFail(): Promise<T> {
		return Promise.resolve({}) as any;
	}

}
