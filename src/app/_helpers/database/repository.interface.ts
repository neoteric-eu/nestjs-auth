import {DeepPartial} from './deep-partial';

export interface Repository<T> {
	find(): Promise<T[]>;
	findOneOrFail(id: any): Promise<T>;
	findOne(cond, opts?): Promise<T>;
	create(model: DeepPartial<T>): T;
	save(model: T): Promise<T>;
	delete(id: any): Promise<T>;
}
