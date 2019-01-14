import { CrudService } from '../../base';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { UserEntity } from './entity';
import { USER_TOKEN } from './user.constants';
import { passwordHash } from '../_helpers';
import { Credentials } from '../auth/dto/credentials';
import {Repository} from '../_helpers/database/repository.interface';

@Injectable()
export class UserService extends CrudService<UserEntity> {

	constructor(@Inject(USER_TOKEN) protected readonly repository: Repository<UserEntity>) {
		super();
	}

	public async login(credentials: Credentials): Promise<UserEntity> {
		const user = await this.repository.findOne({
			email: credentials.email,
			password: passwordHash(credentials.password)
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return user;
	}
}
