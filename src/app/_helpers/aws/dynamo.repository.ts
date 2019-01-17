import {DataMapper} from '@aws/dynamodb-data-mapper';
import {NotFoundException} from '@nestjs/common';
import AWS from 'aws-sdk';
import {plainToClass} from 'class-transformer';
import {Observable} from 'rxjs';
import {config} from '../../../config';
import {AppLogger} from '../../app.logger';
import {Repository, DeepPartial} from '../database';
import {ExtendedEntity} from '../entity';

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

	public async find(options = {}): Promise<T[]> {
		const result = this.mapper.scan(this.entity, options);
		const items = [];
		for await(const item of result) {
			items.push(item);
		}
		return items;
	}

	public findOne(item: object): Promise<T> {
		const result = this.mapper.scan(this.entity, {...item, limit: 1});
		return asyncToObservable<T>(result).toPromise<T>();
	}

	public async findOneOrFail(id: string): Promise<T> {
		const model = plainToClass<T, object>(this.entity, {id});
		const result = await this.mapper.get(model);
		if (!result) {
			throw new NotFoundException(`Item doesn't exists`);
		}
		return result;
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

}
