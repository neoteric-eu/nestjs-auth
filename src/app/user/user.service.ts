import {HttpStatus, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {DateTime} from 'luxon';
import {CrudService} from '../../base';
import {Repository, DeepPartial, passwordHash, RestException} from '../_helpers';
import {AppLogger} from '../app.logger';
import {CredentialsDto} from '../auth/dto/credentials.dto';
import {UserEmailEntity, UserEntity} from './entity';
import {UserErrorEnum} from './user-error.enum';
import {UserSubscriptionService} from './user-subscription.service';
import {USER_EMAIL_TOKEN, USER_TOKEN} from './user.constants';

@Injectable()
export class UserService extends CrudService<UserEntity> {
	private logger = new AppLogger(UserService.name);

	constructor(
		public readonly subscription: UserSubscriptionService,
		@Inject(USER_TOKEN) protected readonly repository: Repository<UserEntity>,
		@Inject(USER_EMAIL_TOKEN) protected readonly userEmailRepository: Repository<UserEmailEntity>
	) {
		super();
	}

	public async findByEmail(email: string): Promise<UserEntity> {
		this.logger.debug(`[findByEmail] Looking in users_email for ${email}`);
		const userEmail = await this.userEmailRepository.findOneOrFail(email);
		this.logger.debug(`[findByEmail] Found in user_email an email ${email}`);

		this.logger.debug(`[findByEmail] Looking in users for ${userEmail.user_id}`);
		const user = await this.repository.findOneOrFail(userEmail.user_id);
		this.logger.debug(`[findByEmail] Found in users an user with id ${user.id}`);
		return user;
	}

	public async login(credentials: CredentialsDto): Promise<UserEntity> {
		const user = await this.findByEmail(credentials.email);

		if (user.password !== passwordHash(credentials.password)) {
			throw new NotFoundException(`Item doesn't exists`);
		}

		if (!user.is_verified) {
			throw new RestException({
				error: 'User',
				message: `User is not verified`,
				condition: UserErrorEnum.NOT_VERIFIED
			}, HttpStatus.PRECONDITION_FAILED);
		}

		return user;
	}

	public async create(data: DeepPartial<UserEntity>): Promise<UserEntity> {
		const entity = this.repository.create(data);
		await this.validate(entity);
		entity.hashPassword();
		if (!entity.createdAt) {
			entity.createdAt = DateTime.utc().toString();
		}
		entity.updatedAt = DateTime.utc().toString();
		const user = await this.repository.save(entity);
		const userEmail = this.userEmailRepository.create({id: user.email, user_id: user.id});
		await Promise.all([
			this.userEmailRepository.save(userEmail),
			this.subscription.create({id: user.id, email: true})
		]);
		return user;
	}

	public async updatePassword(data: DeepPartial<UserEntity>): Promise<UserEntity> {
		const entity = await this.repository.findOneOrFail(data.id);
		entity.password = data.password;
		await this.validate(entity);
		entity.hashPassword();
		entity.updatedAt = DateTime.utc().toString();
		return this.repository.save(entity);
	}

	public async socialRegister(data: DeepPartial<UserEntity>) {
		const entity = this.repository.create(data);
		await this.validate(entity, {skipMissingProperties: true});
		entity.createdAt = DateTime.utc().toString();
		entity.updatedAt = DateTime.utc().toString();
		return this.repository.save(entity);
	}
}
