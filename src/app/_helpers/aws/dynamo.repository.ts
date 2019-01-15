import {Repository} from '../database/repository.interface';
import {ExtendedEntity} from '../entity/extended-entity';
import AWS from 'aws-sdk';
import {plainToClass} from 'class-transformer';
import {DeepPartial} from '../database/deep-partial';
import {DataMapper, DynamoDbTable, ScanIterator} from '@aws/dynamodb-data-mapper';
import {NotFoundException} from '@nestjs/common';
import {config} from '../../../config';
import {AppLogger} from '../../app.logger';

export class DynamoRepository<T extends ExtendedEntity> implements Repository<T> {

	private readonly mapper: DataMapper;
	private readonly logger;

	constructor(dynamo: AWS.DynamoDB, private entity: new () => T) {
		this.mapper = new DataMapper({
			client: dynamo,
			tableNamePrefix: `${config.name}_`
		});
		const DynamoDbTabla = Symbol('DynamoDbTableName');
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

	public async delete(model: T): Promise<T> {
		return this.mapper.delete<T>(model);
	}

	public async find(options): Promise<ScanIterator<T>> {
		return this.mapper.scan(this.entity, options);
	}

	public async findOne(item, options?): Promise<T> {
		return this.mapper.get(item, options);
	}

	public async findOneOrFail(item, options): Promise<T> {
		const result = this.findOne(item, options);
		if (!result) {
			throw new NotFoundException(`Item doesn't exists`);
		}
		return result;
	}

}
