import {forwardRef, HttpException, HttpStatus, Inject} from '@nestjs/common';
import {validate, ValidatorOptions} from 'class-validator';
import {DateTime} from 'luxon';
import {DeepPartial, FindManyOptions, FindOneOptions, MongoRepository, ObjectLiteral} from 'typeorm';
import {ExtendedEntity, typeormFilterMapper} from '../app/_helpers';
import {SecurityService} from '../app/security/security.service';
import {RestVoterActionEnum} from '../app/security/voter';
import {config} from '../config';

export class CrudService<T extends ExtendedEntity> {
	protected repository: MongoRepository<T>;
	@Inject(forwardRef(() => SecurityService)) protected readonly securityService: SecurityService;

	constructor(repository?: MongoRepository<T>) {
		if (repository) {
			this.repository = repository;
		}
	}

	public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
		if (options.where) {
			options.where = typeormFilterMapper(options);
		}
		console.dir(options.where);
		const entities = await this.repository.find(options);
		await this.securityService.denyAccessUnlessGranted(RestVoterActionEnum.READ_ALL, entities);
		return entities;
	}

	public async findOneById(id: string): Promise<T> {
		try {
			const entity = await this.repository.findOneOrFail(id);
			await this.securityService.denyAccessUnlessGranted(RestVoterActionEnum.READ, entity);
			return entity;
		} catch (e) {
			throw new HttpException({
				error: 'Database',
				message: 'Item not found'
			}, HttpStatus.NOT_FOUND);
		}
	}

	public async findOne(options?: FindOneOptions<T>): Promise<T> {
		if (options.where) {
			options.where = typeormFilterMapper(options);
		}
		const entity = await this.repository.findOne(options);
		await this.securityService.denyAccessUnlessGranted(RestVoterActionEnum.READ, entity);
		return entity;
	}

	public async create(data: DeepPartial<T>): Promise<T> {
		const entity: T = this.repository.create(data);
		entity.createdAt = DateTime.utc();
		entity.updatedAt = DateTime.utc();
		await this.securityService.denyAccessUnlessGranted(RestVoterActionEnum.CREATE, entity);
		await this.validate(entity, {
			groups: ['create']
		});
		return entity.save();
	}

	public async saveAll(data: DeepPartial<T>[]): Promise<T[]> {
		return this.repository.save(data);
	}

	public async update(data: DeepPartial<T>|T): Promise<T> {
		const id: string = String(data.id || '');
		return this.patch(id, data);
	}

	public async updateAll(query, data: any): Promise<boolean> {
		if (query) {
			query = typeormFilterMapper({where: query	});
		}
		const response = await this.repository.updateMany(query, data);
		return !!response.matchedCount;
	}

	public async patch(id: string, data: DeepPartial<T>|T): Promise<T> {
		let entity: T = null;
		if (data instanceof ExtendedEntity) {
			entity = data;
		} else {
			entity = await this.findOneById(id);
			if (data.id) {
				delete data.id;
			}
			this.repository.merge(entity, data);
		}
		let createdAt = entity.createdAt;
		if (!createdAt) {
			createdAt = DateTime.utc();
		}
		entity.createdAt = createdAt;
		entity.updatedAt = DateTime.utc();
		await this.securityService.denyAccessUnlessGranted(RestVoterActionEnum.UPDATE, entity);
		await this.validate(entity, {
			groups: ['update']
		});
		return entity.save();
	}

	public async delete(id: string): Promise<T> {
		const entity: T = await this.findOneById(id);
		await this.securityService.denyAccessUnlessGranted(RestVoterActionEnum.UPDATE, entity);
		await this.repository.delete(id);
		return entity;
	}

	public deleteAll(conditions?: ObjectLiteral): Promise<any> {
		if (conditions) {
			conditions = typeormFilterMapper({where: conditions});
		}
		return this.repository.deleteMany(conditions);
	}


	public async softDelete({id}: DeepPartial<T>): Promise<T> {
		const entity = await this.findOneById(id as any);
		await this.securityService.denyAccessUnlessGranted(RestVoterActionEnum.SOFT_DELETE, entity);
		entity.isDeleted = true;
		entity.updatedAt = DateTime.utc();
		return entity.save();
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
