import AWS from 'aws-sdk';
import {DataMapper} from '@aws/dynamodb-data-mapper';
import {NotFoundException} from '@nestjs/common';
import {plainToClass} from 'class-transformer';
import {Observable} from 'rxjs';
import {config} from '../../../config';
import {AppLogger} from '../../app.logger';
import {Repository, DeepPartial} from '../database';
import {ExtendedEntity} from '../entity';
import {graphqlFilterMapper} from './graphql-filter.mapper';
import {DynamoException} from './dynamo.exception';

export type Constructor<T> = new(...args: any[]) => T;

function asyncToObservable<T>(iterable: AsyncIterableIterator<T>): Observable<T> {
	return new Observable(observer => void (async () => {
		try {
			for await (const item of iterable) {
				if (observer.closed) { return; }
				observer.next(item);
			}
			observer.complete();
		} catch (e) {
			observer.error(e);
		}
	})());
}

export class DynamoRepository<T extends ExtendedEntity> implements Repository<T> {

	private readonly mapper: DataMapper;
	private readonly logger: AppLogger;

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

	public async find(options: any): Promise<T[]> {
		try {
			if (options.filter) {
				options.filter = {
					type: 'And',
					conditions: graphqlFilterMapper(options.filter)
				};
			}
			const result = this.mapper.scan(this.entity, options);
			const items = [];
			for await(const item of result) {
				items.push(item);
			}
			return items;
		} catch (e) {
			throw new DynamoException(e.message);
		}
	}

	public findOne(item: object): Promise<T> {
		try {
			const result = this.mapper.scan(this.entity, {...item, limit: 1});
			return asyncToObservable<T>(result).toPromise<T>();
		} catch (e) {
			throw new DynamoException(e.message);
		}
	}

	public async findOneOrFail(id: string): Promise<T> {
		try {
			const model = plainToClass<T, object>(this.entity, {id});
			const result = await this.mapper.get(model);
			if (!result) {
				throw new NotFoundException({message: `Item doesn't exists`});
			}
			return result;
		} catch (e) {
			throw new DynamoException(e.message);
		}
	}

	public create(data: DeepPartial<T>): T {
		return plainToClass<T, DeepPartial<T>>(this.entity, data);
	}

	public async save(model: T): Promise<T> {
		try {
			return this.mapper.put<T>(model);
		} catch (e) {
			throw new DynamoException(e.message);
		}
	}

	public async bulkSave(data: DeepPartial<T[]>): Promise<T[]> {
		try {
			const items = data.map(item => this.create(item));
			const result = this.mapper.batchPut(items);
			const collected = [];
			for await (const item of result) {
				collected.push(item);
			}
			return collected;
		} catch (e) {
			console.error(e);
			throw new DynamoException(e.message);
		}
	}

	public async delete(id: string): Promise<T> {
		try {
			const model = plainToClass<T, object>(this.entity, {id});
			return this.mapper.delete<T>(model);
		} catch (e) {
			throw new DynamoException(e.message);
		}
	}

	public async deleteAll(options: any): Promise<T[]> {
		try {
			if (options.filter) {
				options.filter = {
					type: 'And',
					conditions: graphqlFilterMapper(options.filter)
				};
			}
			const result = this.mapper.scan(this.entity, options) as any;
			const items = [];
			const deletedItems = [];
			for await(const item of result) {
				items.push(item);
			}
			for await (const deletedItem of this.mapper.batchDelete(items)) {
				deletedItems.push(deletedItem);
			}
			return deletedItems;
		} catch (e) {
			throw new DynamoException(e.message);
		}
	}
}
