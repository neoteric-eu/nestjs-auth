import {config} from '../../config';
import {AWS_CON_TOKEN, DB_CON_TOKEN} from './database.constants';
import AWS from 'aws-sdk';
import {createConnection} from 'typeorm';

export const databaseProviders = [
	{
		provide: AWS_CON_TOKEN,
		useFactory: async () => {
			AWS.config.update({
				accessKeyId: config.aws.api_key,
				secretAccessKey: config.aws.secret_key,
				region: config.aws.region
			});
			return new AWS.DynamoDB();
		}
	},
	{
		provide: DB_CON_TOKEN,
		useFactory: async () => createConnection(config.database)
	}
];
