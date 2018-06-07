import {Connection, Repository} from 'typeorm';
import {DB_CON_TOKEN} from '../database/database.constants';
import {ACCESS_CONTROL_TOKEN} from './access-control.constants';
import {AccessControlEntity} from './entity';
import {ROLES_BUILDER_TOKEN} from 'nest-access-control/constants';
import {RolesBuilder} from 'nest-access-control';


export const accessControlProviders = [
	{
		provide: ACCESS_CONTROL_TOKEN,
		useFactory: (connection: Connection) => connection.getRepository(AccessControlEntity),
		inject: [DB_CON_TOKEN]
	},
	{
		provide: ROLES_BUILDER_TOKEN,
		useFactory: async (ace: Repository<AccessControlEntity>) => {
			const grants = await ace.find();
			return new RolesBuilder(grants);
		},
		inject: [ACCESS_CONTROL_TOKEN]
	}
];
