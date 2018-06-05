import { Connection } from 'typeorm';
import { DB_CON_TOKEN } from '../database/database.constants';
import { UserEntity } from './entity';
import { USER_TOKEN } from './user.constants';

export const userProviders = [
	{
		provide: USER_TOKEN,
		useFactory: (connection: Connection) => connection.getRepository(UserEntity),
		inject: [DB_CON_TOKEN]
	}
];
