import AWS from 'aws-sdk';
import {DB_CON_TOKEN} from '../database/database.constants';
import {HomeMediaEntity} from './entity';
import {HOME_MEDIA_TOKEN} from './home-media.constants';
import {DynamoRepository} from '../_helpers/';

export const homeMediaProviders = [
	{
		provide: HOME_MEDIA_TOKEN,
		useFactory: async (dynamoDB: AWS.DynamoDB) => {
			const repository = new DynamoRepository(dynamoDB, HomeMediaEntity);
			await repository.setup();
			return repository;
		},
		inject: [DB_CON_TOKEN]
	}
];
