import {DB_CON_TOKEN} from '../database/database.constants';
import {CONTRACT_TOKEN} from './contract.constants';
import {ContractEntity} from './entity';
import {Connection} from 'typeorm';

export const contractProviders = [
	{
		provide: CONTRACT_TOKEN,
		useFactory: (connection: Connection) => connection.getRepository(ContractEntity),
		inject: [DB_CON_TOKEN]
	}
];
