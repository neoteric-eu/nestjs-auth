import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppLogger } from './app.logger';
import { DatabaseModule } from './database/database.module';
import { AppGateway } from './app.gateway';
import { UserModule } from './user/user.module';
import { AccessControlModule } from './access-control/access-control.module';
import { MessageModule } from './message/message.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
	imports: [
		MetricsModule,
		AccessControlModule,
		DatabaseModule,
		AuthModule,
		UserModule,
		MessageModule
	],
	providers: [AppGateway]
})
export class AppModule {
	private logger = new AppLogger(AppModule.name);

	constructor() {
		this.logger.log('Initialize');
	}
}
