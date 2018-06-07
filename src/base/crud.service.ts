import { UnprocessableEntityException } from '@nestjs/common';
import { BaseEntity, DeleteResult, Repository, DeepPartial } from 'typeorm';
import { validate } from 'class-validator';
import { config } from '../config';
import {FindOneOptions} from 'typeorm/find-options/FindOneOptions';
import {FindConditions} from 'typeorm/find-options/FindConditions';

export class CrudService<T extends BaseEntity> {
	protected repository: Repository<T>;

	public async findAll(): Promise<T[]> {
		return await this.repository.find();
	}

	public async findOneById(id: number): Promise<T> {
		return this.repository.findOneOrFail(id);
	}

	public async findOne(conditions?: FindConditions<T>, options?: FindOneOptions<T>): Promise<T> {
		return this.repository.findOne(conditions, options);
	}

	public async create(data: DeepPartial<T>): Promise<T> {
		const entity: T = this.repository.create(data);
		await this.validate(entity);
		return entity.save();
	}

	public async update(data: DeepPartial<T>): Promise<T> {
		return this.create(data);
	}

	public async patch(id: number, data: DeepPartial<T>): Promise<T> {
		const entity: T = await this.findOneById(id);
		Object.assign(entity, data);
		await this.validate(entity);
		return entity.save();
	}

	public async delete(id: number): Promise<DeleteResult> {
		return this.repository.delete(id);
	}

	private async validate(entity: T) {
		const errors = await validate(entity, config.validator);
		if (errors.length) {
			throw new UnprocessableEntityException(errors);
		}
	}
}
