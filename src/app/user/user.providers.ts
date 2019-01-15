import AWS from 'aws-sdk';
import { DB_CON_TOKEN } from '../database/database.constants';
import { UserEntity } from './entity';
import { USER_TOKEN } from './user.constants';
import { DynamoRepository } from '../_helpers/';

export const userProviders = [
	{
		provide: USER_TOKEN,
		useFactory: async (dynamoDB: AWS.DynamoDB) => {
			const repository = new DynamoRepository(dynamoDB, UserEntity);
			await repository.setup();
			return repository;
		},
		inject: [DB_CON_TOKEN]
	}
];
