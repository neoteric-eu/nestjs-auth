import {DB_CON_TOKEN} from '../database/database.constants';
import {CONVERSATION_TOKEN, MESSAGE_TOKEN, USER_CONVERSATION_TOKEN} from './message.constants';
import {MessageEntity, ConversationEntity, UserConversationEntity} from './entity';
import {Connection} from 'typeorm';

export const messageProviders = [
	{
		provide: MESSAGE_TOKEN,
		useFactory: (connection: Connection) => connection.getRepository(MessageEntity),
		inject: [DB_CON_TOKEN]
	},
	{
		provide: CONVERSATION_TOKEN,
		useFactory: (connection: Connection) => connection.getRepository(ConversationEntity),
		inject: [DB_CON_TOKEN]
	},
	{
		provide: USER_CONVERSATION_TOKEN,
		useFactory: (connection: Connection) => connection.getRepository(UserConversationEntity),
		inject: [DB_CON_TOKEN]
	}
];
