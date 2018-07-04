import { config } from '../../config';
import { createConnection } from 'typeorm';
import { DB_CON_TOKEN } from './database.constants';
import { AppQueryLogger } from '../index';

export const databaseProviders = [
	{
		provide: DB_CON_TOKEN,
		useFactory: async () => createConnection({
			...config.database,
			logger: new AppQueryLogger()
		})
	}
];
