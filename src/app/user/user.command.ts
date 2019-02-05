import {Injectable } from '@nestjs/common';
import {Command, Positional} from 'nestjs-command';
import {DateTime} from 'luxon';
import {UserService} from './user.service';
import {UserEntity} from './entity';
import faker from 'faker';
import {passwordHash} from '../_helpers';
import {AppLogger} from '../app.logger';

@Injectable()
export class UserCommand {

	private logger = new AppLogger(UserCommand.name);

	constructor(
		private readonly userService: UserService
	) {
		faker.locale = 'en_US';
	}

	// example usage: npm run cli -- create:user 100
	@Command({ command: 'create:user [amount]', describe: 'create a user' })
	public async create(@Positional({name: 'amount'}) amount) {
		amount = parseInt(amount || 10, 10);
		this.logger.debug(`[create] execute for amount ${amount}!`);

		this.logger.debug(`[create] delete from db everything with provider "faker"`);
		await this.userService.deleteAll({filter: {provider: {eq: 'faker'}}});

		const persons: UserEntity[] = [];
		for (let i = 0; i < amount; i++) {
			const first_name = faker.name.firstName();
			const last_name = faker.name.lastName();
			const person: UserEntity = {
				first_name,
				last_name,
				is_verified: true,
				provider: 'faker',
				socialId: faker.random.uuid(),
				email: faker.internet.email(first_name, last_name).toLowerCase(),
				password: passwordHash(faker.internet.password()),
				phone_num: faker.phone.phoneNumber(),
				profile_img: faker.internet.avatar(),
				createdAt: DateTime.utc().toString(),
				updatedAt: DateTime.utc().toString()
			} as any;
			persons.push(person);
		}

		this.logger.debug(`[create] create ${amount} random ppl with provider "faker"`);
		await this.userService.bulkSave(persons);
	}
}
