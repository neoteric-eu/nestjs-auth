import {UnprocessableEntityException} from '@nestjs/common';
import {validate} from 'class-validator';
import {Observable, from} from 'rxjs';
import {map} from 'rxjs/operators';
import {config} from '../config';
import {ExtendedEntity, DeepPartial, Repository} from '../app/_helpers';

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

export class CrudService<T extends ExtendedEntity> {
	protected repository: Repository<T>;

	public findAll(conditions, options?): Observable<T[]> {
		const observable = from(this.repository.find(conditions, options));
		return observable.pipe(map((result: any) => asyncToObservable<T[]>(result))) as any;
	}

	public async findOneById(id: string): Promise<T> {
		return this.repository.findOneOrFail(id);
	}

	public findOne(conditions?: any, options?: any): Observable<T> {
		return this.repository.findOne(conditions, options);
	}

	public async create(data: DeepPartial<T>): Promise<T> {
		const entity: T = this.repository.create(data);
		await this.validate(entity);
		return this.repository.save(entity);
	}

	public async update(data: DeepPartial<T>): Promise<T> {
		return this.create(data);
	}

	public async patch(id: string, data: DeepPartial<T>): Promise<T> {
		const entity: T = await this.findOneById(id);
		Object.assign(entity, data);
		await this.validate(entity);
		return this.repository.save(entity);
	}

	public async delete(id: string): Promise<T> {
		return this.repository.delete(id);
	}

	private async validate(entity: T) {
		const errors = await validate(entity, config.validator);
		if (errors.length) {
			throw new UnprocessableEntityException(errors);
		}
	}
}
