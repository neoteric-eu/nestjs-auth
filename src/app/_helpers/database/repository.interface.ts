import {DeepPartial} from './deep-partial';
import {ScanIterator} from '@aws/dynamodb-data-mapper';

export interface Repository<T> {
	find(items, options?): Promise<ScanIterator<T>>;
	findOneOrFail(id: string|number): Promise<T>;
	findOne(cond, opts?): Promise<T>;
	create(model: DeepPartial<T>): T;
	save(model: T): Promise<T>;
	delete(id: string): Promise<T>;
}
