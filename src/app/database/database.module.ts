import { Global, Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import {DB_CON_TOKEN} from './database.constants';

@Global()
@Module({
	providers: [...databaseProviders],
	exports: [...databaseProviders]
})
export class DatabaseModule implements OnModuleDestroy {
	constructor(@Inject(DB_CON_TOKEN) private readonly dbConnection) {}

	public onModuleDestroy(): void {
		this.dbConnection.close();
	}
}
