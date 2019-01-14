export interface Repository<T> {
	find(): Promise<T[]>;
	findOneOrFail(): Promise<T>;
	findOne(): Promise<T>;
	create(model: T): Promise<T>;
	delete(): Promise<T>;
}
