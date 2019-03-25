import {DB_CON_TOKEN} from '../database/database.constants';
import {HomeEntity, HomePdfEntity} from './entity';
import {HOME_PDF_TOKEN, HOME_TOKEN} from './home.constants';
import {Connection} from 'typeorm';

export const homeProviders = [
	{
		provide: HOME_TOKEN,
		useFactory: (connection: Connection) => connection.getMongoRepository(HomeEntity),
		inject: [DB_CON_TOKEN]
	},
	{
		provide: HOME_PDF_TOKEN,
		useFactory: (connection: Connection) => connection.getMongoRepository(HomePdfEntity),
		inject: [DB_CON_TOKEN]
	}
];
