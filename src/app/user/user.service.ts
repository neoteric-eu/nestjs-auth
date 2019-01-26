import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {DateTime} from 'luxon';
import {CrudService} from '../../base';
import {UserEntity} from './entity';
import {USER_TOKEN} from './user.constants';
import {DeepPartial, passwordHash} from '../_helpers';
import {CredentialsDto} from '../auth/dto/credentials.dto';
import {Repository} from '../_helpers/database';

@Injectable()
export class UserService extends CrudService<UserEntity> {

	constructor(@Inject(USER_TOKEN) protected readonly repository: Repository<UserEntity>) {
		super();
	}

	public async login(credentials: CredentialsDto): Promise<UserEntity> {
		const user = await this.repository.find({
			filter: {
				email: {eq: credentials.email},
				password: {eq: passwordHash(credentials.password)}
			},
			limit: 1
		});

		if (!user || !user.length) {
			throw new NotFoundException('User not found');
		}

		return user[0];
	}

	public async create(data: DeepPartial<UserEntity>): Promise<UserEntity> {
		const entity = this.repository.create(data);
		await this.validate(entity);
		entity.hashPassword();
		if (!entity.createdAt) {
			entity.createdAt = DateTime.utc().toString();
		}
		entity.updatedAt = DateTime.utc().toString();
		return this.repository.save(entity);
	}

	public async socialRegister(data: DeepPartial<UserEntity>) {
		const entity = this.repository.create(data);
		await this.validate(entity, { skipMissingProperties: true });
		entity.createdAt = DateTime.utc().toString();
		entity.updatedAt = DateTime.utc().toString();
		return this.repository.save(entity);
	}
}
