import { config } from '../../config';
import { createConnection } from 'typeorm';
import { CACHE_CON_TOKEN, DB_CON_TOKEN } from './database.constants';
import { AppQueryLogger } from '../index';
import { createClient, RedisClient } from 'redis';

export const databaseProviders = [
	{
		provide: DB_CON_TOKEN,
		useFactory: async () => createConnection({
			...config.database,
			logger: new AppQueryLogger()
		})
	},
	{
		provide: CACHE_CON_TOKEN,
		useFactory: async (): Promise<RedisClient> => {
			return new Promise<RedisClient>(resolve => {
				const client = createClient({
					host: config.cache.host,
					port: config.cache.port
				});
				client.on('ready', () => resolve(client));
			});
		}
	}
];
