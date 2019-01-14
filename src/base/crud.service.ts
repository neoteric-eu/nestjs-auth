import { UnprocessableEntityException } from '@nestjs/common';
import { validate } from 'class-validator';
import { config } from '../config';
import {ExtendedEntity, DeepPartial, Repository} from '../app/_helpers';

export class CrudService<T extends ExtendedEntity> {
	protected repository: Repository<T>;

	public async findAll({user: any}): Promise<T[]> {
		return await this.repository.find();
	}

	public async findOneById(id: number): Promise<T> {
		return this.repository.findOneOrFail(id);
	}

	public async findOne(conditions?: any, options?: any): Promise<T> {
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

	public async patch(id: number, data: DeepPartial<T>): Promise<T> {
		const entity: T = await this.findOneById(id);
		Object.assign(entity, data);
		await this.validate(entity);
		return this.repository.save(entity);
	}

	public async delete(id: number): Promise<T> {
		return this.repository.delete(id);
	}

	private async validate(entity: T) {
		const errors = await validate(entity, config.validator);
		if (errors.length) {
			throw new UnprocessableEntityException(errors);
		}
	}
}
