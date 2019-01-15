import AWS from 'aws-sdk';
import {plainToClass} from 'class-transformer';
import {NotFoundException} from '@nestjs/common';
import {DataMapper, ScanIterator} from '@aws/dynamodb-data-mapper';
import {Repository} from '../database/repository.interface';
import {ExtendedEntity} from '../entity/extended-entity';
import {DeepPartial} from '../database/deep-partial';
import {config} from '../../../config';
import {AppLogger} from '../../app.logger';

export type Constructor<T> = new(...args: any[]) => T;

export class DynamoRepository<T extends ExtendedEntity> implements Repository<T> {

	private readonly mapper: DataMapper;
	private readonly logger;

	constructor(dynamo: AWS.DynamoDB, private entity: Constructor<T>) {
		this.mapper = new DataMapper({
			client: dynamo,
			tableNamePrefix: `${config.name}_`
		});
		this.logger = new AppLogger(`DynamoRepository [${config.name}_${this.entity.name}]`);
	}

	public async setup(): Promise<void> {
		await this.mapper.ensureTableExists(this.entity, {
			readCapacityUnits: 5,
			writeCapacityUnits: 5
		});
		this.logger.debug('table should exists');
	}

	public create(data: DeepPartial<T>): T {
		return plainToClass<T, DeepPartial<T>>(this.entity, data);
	}

	public async save(model: T): Promise<T> {
		return this.mapper.put<T>(model);
	}

	public async delete(id: string): Promise<T> {
		const model = plainToClass<T, object>(this.entity, {id});
		return this.mapper.delete<T>(model);
	}

	public async find(options): Promise<ScanIterator<T>> {
		return this.mapper.scan(this.entity, options);
	}

	public async findOne(item: object, options?): Promise<T> {
		const model = plainToClass<T, object>(this.entity, item);
		return this.mapper.get(model, options);
	}

	public async findOneOrFail(id: string): Promise<T> {
		const model = plainToClass<T, object>(this.entity, {id});
		const result = await this.mapper.get(model);
		if (!result) {
			throw new NotFoundException(`Item doesn't exists`);
		}
		return result;
	}

}
