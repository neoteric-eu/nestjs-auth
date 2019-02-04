import {Injectable} from '@nestjs/common';
import {Command, Positional} from 'nestjs-command';
import {DateTime} from 'luxon';
import {HomeService} from './home.service';
import faker from 'faker';
import {AppLogger} from '../app.logger';
import {HomeEntity} from './entity';
import {UserService} from '../user/user.service';
import {HomeMediaService} from '../home-media/home-media.service';
import {DeepPartial} from '../_helpers/database';
import {HomeMediaEntity} from '../home-media/entity';
import {HomeFavoriteEntity} from '../home-favorite/entity';
import {HomeFavoriteService} from '../home-favorite/home-favorite.service';

@Injectable()
export class HomeCommand {

	private logger = new AppLogger(HomeCommand.name);

	constructor(
		private readonly homeService: HomeService,
		private readonly homeMediaService: HomeMediaService,
		private readonly homeFavoriteService: HomeFavoriteService,
		private readonly userSerivce: UserService
	) {
		faker.locale = 'en_US';
	}

	@Command({ command: 'create:home [amount]', describe: 'create a random fake homes' })
	public async create(@Positional({name: 'amount'}) amount) {
		amount = parseInt(amount || 50, 10);
		this.logger.debug(`[create] execute for amount ${amount}!`);

		this.logger.debug(`[create] delete from home everything with json "faker"`);
		await this.homeService.deleteAll({filter: {json: {eq: '{"faker": true}'}}});
		this.logger.debug(`[create] delete from home_media everything with mimetype "image/fake"`);
		await this.homeMediaService.deleteAll({filter: {mimetype: {eq: 'image/fake'}}});
		this.logger.debug(`[create] delete from home_favorites everything with fake`);
		await this.homeMediaService.deleteAll({filter: {fake: {eq: true}}});

		this.logger.debug(`[create] fetch random 20 faked users`);
		const users = await this.userSerivce.findAll({filter: { provider: {eq: 'faker'}}, limit: 20});
		const usersIds = users.map(user => user.id);

		const homes: HomeEntity[] = [];
		for (let i = 0; i < amount; i++) {
			const home: HomeEntity = {
				owner: faker.random.arrayElement(usersIds),
				json: '{"faker": true}',
				price: Number(faker.finance.amount(100000, 1000000)),
				price_adjustment: faker.random.number(100),
				descr: faker.lorem.paragraphs(faker.random.number({max: 5, min: 1})),
				address_1: faker.address.streetAddress(),
				address_2: faker.address.secondaryAddress(),
				city: faker.address.city(),
				state: faker.address.state(),
				zip: faker.address.zipCode(),
				country: faker.address.country(),
				beds: faker.random.number({max: 10, min: 1}),
				baths: faker.random.number({max: 10, min: 1}),
				lot_size: faker.random.number(20),
				sqft: faker.random.number({max: 350, min: 50}),
				lat: Number(faker.address.latitude()),
				lng: Number(faker.address.longitude()),
				pool: faker.random.boolean(),
				fav_count: faker.random.number(10),
				showing_count: faker.random.number({max: 100000, min: 100}),
				buyers_agent: faker.random.boolean()
			} as any;
			if (home.buyers_agent) {
				home.buyers_agent_amt = faker.random.number(1000);
				home.buyers_agent_type = faker.random.number(1000);
			}
			homes.push(home);
		}

		this.logger.debug(`[create] create ${amount} random homes with json {"faker": true}`);

		const savedHomes = await this.homeService.bulkSave(homes);

		this.logger.debug(`[create] create home media for homes`);

		const homeFavs = [];

		for (const home of savedHomes) {
			await this.homeMediaService.bulkSave(this.generateHomeMedias(home.id));
			if (faker.random.boolean()) {
				homeFavs.push({
					homeFavoriteHomeId: home.id,
					homeFavoriteUserId: faker.random.arrayElement(usersIds),
					fake: true
				});
			}
		}

		this.logger.debug(`[create] saving home favorites`);

		await this.homeFavoriteService.bulkSave(homeFavs);

		this.logger.debug(`[create] done!`);
	}

	private generateHomeMedias(homeId: string): DeepPartial<HomeMediaEntity[]> {
		return Array(faker.random.number({min: 2, max: 5, precision: 1})).fill({}).map(() => ({
			homeId,
			originalname: faker.system.commonFileName('jpeg'),
			mimetype: 'image/fake',
			size: faker.random.number({min: 86400, max: 259200}),
			url: 'http://lorempixel.com/640/480/city'
		}));
	}
}
