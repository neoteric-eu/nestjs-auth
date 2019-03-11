import AWS from 'aws-sdk';
import { DB_CON_TOKEN } from '../database/database.constants';
import { HomeEntity } from './entity';
import {HOME_PDF_TOKEN, HOME_TOKEN} from './home.constants';
import { DynamoRepository } from '../_helpers/';
import {HomePdfEntity} from './entity/home-pdf.entity';

export const homeProviders = [
	{
		provide: HOME_TOKEN,
		useFactory: async (dynamoDB: AWS.DynamoDB) => {
			const repository = new DynamoRepository(dynamoDB, HomeEntity);
			await repository.setup();
			return repository;
		},
		inject: [DB_CON_TOKEN]
	},
	{
		provide: HOME_PDF_TOKEN,
		useFactory: async (dynamoDB: AWS.DynamoDB) => {
			const repository = new DynamoRepository(dynamoDB, HomePdfEntity);
			await repository.setup();
			return repository;
		},
		inject: [DB_CON_TOKEN]
	}
];
