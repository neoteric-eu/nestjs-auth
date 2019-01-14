import { config } from '../../config';
import { DB_CON_TOKEN } from './database.constants';
import AWS from 'aws-sdk';

export const databaseProviders = [
	{
		provide: DB_CON_TOKEN,
		useFactory: async () => new AWS.DynamoDB()
	}
];
