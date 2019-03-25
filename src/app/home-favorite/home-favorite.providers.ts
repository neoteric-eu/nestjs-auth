import {DB_CON_TOKEN} from '../database/database.constants';
import {HomeFavoriteEntity} from './entity';
import {HOME_FAVORITE_TOKEN} from './home-favorite.constants';
import {Connection} from 'typeorm';

export const homeFavoriteProviders = [
	{
		provide: HOME_FAVORITE_TOKEN,
		useFactory: (connection: Connection) => connection.getRepository(HomeFavoriteEntity),
		inject: [DB_CON_TOKEN]
	}
];
