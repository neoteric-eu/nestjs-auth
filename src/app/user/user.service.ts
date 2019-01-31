import {HttpException, HttpStatus, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {DateTime} from 'luxon';
import {CrudService} from '../../base';
import {UserEmailEntity, UserEntity} from './entity';
import {USER_EMAIL_TOKEN, USER_SUBSCRIPTION_TOKEN, USER_TOKEN} from './user.constants';
import {DeepPartial, passwordHash} from '../_helpers';
import {CredentialsDto} from '../auth/dto/credentials.dto';
import {Repository} from '../_helpers/database';
import {AppLogger} from '../app.logger';
import {UserSubscriptionEntity} from './entity/user-subscription.entity';

@Injectable()
export class UserService extends CrudService<UserEntity> {

	public readonly subscription: CrudService<UserSubscriptionEntity>;

	private logger = new AppLogger(UserService.name);

	constructor(
		@Inject(USER_TOKEN) protected readonly repository: Repository<UserEntity>,
		@Inject(USER_EMAIL_TOKEN) protected readonly userEmailRepository: Repository<UserEmailEntity>,
		@Inject(USER_SUBSCRIPTION_TOKEN) userSubscription
	) {
		super();
		this.subscription = new CrudService(userSubscription);
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
			throw new NotFoundException({ message: `Item doesn't exists` });
		}

		if (!user.is_verified) {
			throw new HttpException({ message: `User is not verified` }, HttpStatus.PRECONDITION_FAILED);
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
		await this.validate(entity, { skipMissingProperties: true });
		entity.createdAt = DateTime.utc().toString();
		entity.updatedAt = DateTime.utc().toString();
		return this.repository.save(entity);
	}
}
