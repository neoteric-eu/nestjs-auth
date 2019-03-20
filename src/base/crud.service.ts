import {forwardRef, HttpException, HttpStatus, Inject} from '@nestjs/common';
import {validate, ValidatorOptions} from 'class-validator';
import {SecurityService} from '../app/security/security.service';
import {RestVoterActionEnum} from '../app/security/voter';
import {DateTime} from 'luxon';
import {DeepPartial, FindConditions, FindManyOptions, FindOneOptions, Repository} from 'typeorm';
import {config} from '../config';
import {ExtendedEntity} from '../app/_helpers';

export class CrudService<T extends ExtendedEntity> {
	protected repository: Repository<T>;
	@Inject(forwardRef(() => SecurityService)) private readonly securityService: SecurityService;

	constructor(repository?: Repository<T>) {
		if (repository) {
			this.repository = repository;
		}
	}

	public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
		const entities = await this.repository.find(options);
		await this.securityService.denyAccessUnlessGranted(RestVoterActionEnum.READ_ALL, entities);
		return entities;
	}

	public async findOneById(id: string): Promise<T> {
		const entity = await this.repository.findOneOrFail(id);
		await this.securityService.denyAccessUnlessGranted(RestVoterActionEnum.READ, entity);
		return entity;
	}

	public async findOne(conditions?: FindConditions<T>, options?: FindOneOptions<T>): Promise<T> {
		const entity = await this.repository.findOne(conditions, options);
		await this.securityService.denyAccessUnlessGranted(RestVoterActionEnum.READ, entity);
		return entity;
	}

	public async create(data: DeepPartial<T>): Promise<T> {
		const entity: T = this.repository.create(data);
		entity.createdAt = DateTime.utc().toString();
		entity.updatedAt = DateTime.utc().toString();
		await this.securityService.denyAccessUnlessGranted(RestVoterActionEnum.CREATE, entity);
		await this.validate(entity);
		return entity.save();
	}

	public async saveAll(data: DeepPartial<T>[]): Promise<T[]> {
		return this.repository.save(data);
	}

	public async update(data: DeepPartial<T>): Promise<T> {
		const id: string = String(data.id || '');
		return this.patch(id, data);
	}

	public async patch(id: string, data: DeepPartial<T>): Promise<T> {
		const entity: T = await this.findOneById(id);
		let createdAt = entity.createdAt;
		if (!createdAt) {
			createdAt = DateTime.utc().toString();
		}
		Object.assign(entity, data);
		entity.createdAt = createdAt;
		entity.updatedAt = DateTime.utc().toString();
		await this.securityService.denyAccessUnlessGranted(RestVoterActionEnum.UPDATE, entity);
		await this.validate(entity);
		return entity.save();
	}

	public async delete(id: string): Promise<T> {
		const entity: T = await this.findOneById(id);
		await this.securityService.denyAccessUnlessGranted(RestVoterActionEnum.UPDATE, entity);
		await this.repository.delete(id);
		return entity;
	}

	public deleteAll(conditions?): Promise<any> {
		return this.repository.delete(conditions);
	}

	protected async validate(entity: T, options?: ValidatorOptions) {
		const errors = await validate(entity, {...config.validator, options} as ValidatorOptions);
		if (errors.length) {
			throw new HttpException({
				message: errors,
				error: 'Validation'
			}, HttpStatus.UNPROCESSABLE_ENTITY);
		}
	}
}
