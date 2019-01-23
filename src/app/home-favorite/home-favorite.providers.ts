import AWS from 'aws-sdk';
import { DB_CON_TOKEN } from '../database/database.constants';
import { HomeFavoriteEntity } from './entity';
import {HOME_FAVORITE_TOKEN} from './home-favorite.constants';
import { DynamoRepository } from '../_helpers/';

export const homeFavoriteProviders = [
	{
		provide: HOME_FAVORITE_TOKEN,
		useFactory: async (dynamoDB: AWS.DynamoDB) => {
			const repository = new DynamoRepository(dynamoDB, HomeFavoriteEntity);
			await repository.setup();
			return repository;
		},
		inject: [DB_CON_TOKEN]
	}
];
