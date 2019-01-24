import {UnprocessableEntityException} from '@nestjs/common';
import {validate} from 'class-validator';
import {config} from '../config';
import {ExtendedEntity, DeepPartial, Repository} from '../app/_helpers';

export class CrudService<T extends ExtendedEntity> {
	protected repository: Repository<T>;

	public findAll(conditions?): Promise<T[]> {
		return this.repository.find(conditions);
	}

	public async findOneById(id: string): Promise<T> {
		return this.repository.findOneOrFail(id);
	}

	public findOne(conditions?: any): Promise<T> {
		return this.repository.findOne(conditions);
	}

	public async create(data: DeepPartial<T>): Promise<T> {
		const entity: T = this.repository.create(data);
		// await this.validate(entity);
		return this.repository.save(entity);
	}

	public async update(data: DeepPartial<T>): Promise<T> {
		return this.create(data);
	}

	public async patch(id: string, data: DeepPartial<T>): Promise<T> {
		const entity: T = await this.findOneById(id);
		Object.assign(entity, data);
		// await this.validate(entity);
		return this.repository.save(entity);
	}

	public async delete(id: string): Promise<T> {
		return this.repository.delete(id);
	}

	public deleteAll(conditions?): Promise<T[]> {
		return this.repository.deleteAll(conditions);
	}

	private async validate(entity: T) {
		const errors = await validate(entity, config.validator);
		if (errors.length) {
			throw new UnprocessableEntityException(errors);
		}
	}
}
