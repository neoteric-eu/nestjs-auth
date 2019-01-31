import AWS from 'aws-sdk';
import { DB_CON_TOKEN } from '../database/database.constants';
import { DynamoRepository } from '../_helpers/';
import {CONVERSATION_TOKEN, MESSAGE_TOKEN, USER_CONVERSATION_TOKEN} from './message.constants';
import { MessageEntity } from './entity/message.entity';
import {ConversationEntity, UserConversationEntity} from './entity';

export const messageProviders = [
	{
		provide: MESSAGE_TOKEN,
		useFactory: async (dynamoDB: AWS.DynamoDB) => {
			const repository = new DynamoRepository(dynamoDB, MessageEntity);
			await repository.setup();
			return repository;
		},
		inject: [DB_CON_TOKEN]
	},
	{
		provide: CONVERSATION_TOKEN,
		useFactory: async (dynamoDB: AWS.DynamoDB) => {
			const repository = new DynamoRepository(dynamoDB, ConversationEntity);
			await repository.setup();
			return repository;
		},
		inject: [DB_CON_TOKEN]
	},
	{
		provide: USER_CONVERSATION_TOKEN,
		useFactory: async (dynamoDB: AWS.DynamoDB) => {
			const repository = new DynamoRepository(dynamoDB, UserConversationEntity);
			await repository.setup();
			return repository;
		},
		inject: [DB_CON_TOKEN]
	}
];
