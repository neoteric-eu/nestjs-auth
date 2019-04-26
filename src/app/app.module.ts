import {MiddlewareConsumer, Module, RequestMethod} from '@nestjs/common';
import {CommandModule} from 'nestjs-command';
import {AuthModule} from './auth/auth.module';
import {AppLogger} from './app.logger';
import {ContractModule} from './contract/contract.module';
import {DatabaseModule} from './database/database.module';
import {GraphQLModule} from '@nestjs/graphql';
import {HealthCheckModule} from './healtcheck/healthcheck.module';
import {HomeModule} from './home/home.module';
import {UserModule} from './user/user.module';
import {MessageModule} from './message/message.module';
import {HomeFavoriteModule} from './home-favorite/home-favorite.module';
import {MediaModule} from './media/media.module';
import {HomeMediaModule} from './home-media/home-media.module';
import {GqlConfigService, RequestContextMiddleware} from './_helpers';
import {SecurityModule} from './security';

@Module({
	imports: [
		CommandModule,
		HealthCheckModule,
		SecurityModule,
		DatabaseModule,
		AuthModule,
		UserModule,
		MediaModule,
		HomeModule,
		HomeFavoriteModule,
		HomeMediaModule,
		MessageModule,
		ContractModule,
		GraphQLModule.forRootAsync({
			imports: [UserModule],
			useClass: GqlConfigService
		})
	]
})
export class AppModule {
	private logger = new AppLogger(AppModule.name);

	constructor() {
		this.logger.log('Initialize constructor');
	}

	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(RequestContextMiddleware)
			.forRoutes({path: '*', method: RequestMethod.ALL});
	}
}
