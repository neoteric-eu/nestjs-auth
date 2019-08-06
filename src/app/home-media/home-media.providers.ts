import {DB_CON_TOKEN} from '../database/database.constants';
import {HomeMediaEntity} from './entity';
import {HOME_MEDIA_TOKEN} from './home-media.constants';
import {Connection} from 'typeorm';

export const homeMediaProviders = [
	{
		provide: HOME_MEDIA_TOKEN,
		useFactory: (connection: Connection) => connection.getRepository(HomeMediaEntity),
		inject: [DB_CON_TOKEN]
	}
];
