import { config } from '../../config';
import { DB_CON_TOKEN } from './database.constants';
import AWS from 'aws-sdk';

export const databaseProviders = [
	{
		provide: DB_CON_TOKEN,
		useFactory: async () => {
			AWS.config.update({
				accessKeyId: config.aws.api_key,
				secretAccessKey: config.aws.secret_key,
				region: config.aws.region
			});
			return new AWS.DynamoDB();
		}
	}
];
