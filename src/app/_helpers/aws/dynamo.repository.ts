import {Repository} from '../database/repository.interface';
import {ExtendedEntity} from '../entity/extended-entity';
import AWS from 'aws-sdk';
import {plainToClass} from 'class-transformer';


export class DynamoRepository<T extends ExtendedEntity> implements Repository<T> {

	constructor(private dynamo: AWS.DynamoDB, private entity: new () => T) {

	}

	async create(model: T): Promise<T> {
		return this.dynamo.putItem(model.toDynamoDB()).promise().then(() => new this.entity());
	}

	async delete(): Promise<T> {
	}

	public async find(): T[] {
		const params = { RequestItems : {} };
		params.RequestItems[this.entity.constructor.name] = {};
		return this.dynamo.batchGetItem(params)/*
			.promise()
			.then(respose => {
				const items = [];
				for (const node of respose) {
					items.push({
						...Object.keys(node)
					});
				}
				return plainToClass(this.entity, items);
			})*/;
	}

	findOne() {
	}

	findOneOrFail() {
	}

}
