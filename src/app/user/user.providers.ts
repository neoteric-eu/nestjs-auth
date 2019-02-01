import AWS from 'aws-sdk';
import {DB_CON_TOKEN} from '../database/database.constants';
import {UserEmailEntity, UserEntity} from './entity';
import {USER_EMAIL_TOKEN, USER_SUBSCRIPTION_TOKEN, USER_TOKEN} from './user.constants';
import {DynamoRepository} from '../_helpers/';
import {UserSubscriptionEntity} from './entity/user-subscription.entity';

export const userProviders = [
	{
		provide: USER_TOKEN,
		useFactory: async (dynamoDB: AWS.DynamoDB) => {
			const repository = new DynamoRepository(dynamoDB, UserEntity);
			await repository.setup();
			return repository;
		},
		inject: [DB_CON_TOKEN]
	},
	{
		provide: USER_EMAIL_TOKEN,
		useFactory: async (dynamoDB: AWS.DynamoDB) => {
			const repository = new DynamoRepository(dynamoDB, UserEmailEntity);
			await repository.setup();
			return repository;
		},
		inject: [DB_CON_TOKEN]
	},
	{
		provide: USER_SUBSCRIPTION_TOKEN,
		useFactory: async (dynamoDB: AWS.DynamoDB) => {
			const repository = new DynamoRepository(dynamoDB, UserSubscriptionEntity);
			await repository.setup();
			return repository;
		},
		inject: [DB_CON_TOKEN]
	}
];
