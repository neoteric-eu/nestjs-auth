import {forwardRef, HttpException, HttpStatus, Inject, OnModuleInit} from '@nestjs/common';
import {validate, ValidatorOptions} from 'class-validator';
import {SecurityService} from '../app/security/security.service';
import {RestVoterActionEnum} from '../app/security/voter';
import {config} from '../config';
import {ExtendedEntity, DeepPartial, Repository} from '../app/_helpers';

export class CrudService<T extends ExtendedEntity> {
	protected repository: Repository<T>;
	@Inject(forwardRef(() => SecurityService)) private readonly securityService: SecurityService;

	constructor(repository?: Repository<T>) {
		if (repository) {
			this.repository = repository;
		}
	}

	public async findAll(conditions?): Promise<T[]> {
		const entities = await this.repository.find(conditions);
		await this.securityService.denyAccessUnlessGranted(RestVoterActionEnum.READ_ALL, entities);
		return entities;
	}

	public async findOneById(id: string): Promise<T> {
		const entity = await this.repository.findOneOrFail(id);
		await this.securityService.denyAccessUnlessGranted(RestVoterActionEnum.READ, entity);
		return entity;
	}

	public async findOne(conditions?: any): Promise<T> {
		const entity = await this.repository.findOne(conditions);
		await this.securityService.denyAccessUnlessGranted(RestVoterActionEnum.READ, entity);
		return entity;
	}

	public async create(data: DeepPartial<T>): Promise<T> {
		const entity: T = this.repository.create(data);
		await this.securityService.denyAccessUnlessGranted(RestVoterActionEnum.CREATE, entity);
		await this.validate(entity);
		return this.repository.save(entity);
	}

	public async saveAll(data: DeepPartial<T[]>): Promise<T[]> {
		return this.repository.bulkSave(data);
	}

	public async update(data: DeepPartial<T>): Promise<T> {
		return this.create(data);
	}

	public async patch(id: string, data: DeepPartial<T>): Promise<T> {
		const entity: T = await this.findOneById(id);
		Object.assign(entity, data);
		await this.securityService.denyAccessUnlessGranted(RestVoterActionEnum.UPDATE, entity);
		await this.validate(entity);
		return this.repository.save(entity);
	}

	public async delete(id: string): Promise<T> {
		const entity: T = await this.findOneById(id);
		await this.securityService.denyAccessUnlessGranted(RestVoterActionEnum.UPDATE, entity);
		return this.repository.delete(id);
	}

	public deleteAll(conditions?): Promise<T[]> {
		return this.repository.deleteAll(conditions);
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
