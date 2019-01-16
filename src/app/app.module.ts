import {Module} from '@nestjs/common';
import {join} from 'path';
import {AuthModule} from './auth/auth.module';
import {AppLogger} from './app.logger';
import {CatsModule} from './cats/cats.module';
import {DatabaseModule} from './database/database.module';
import {GraphQLModule} from '@nestjs/graphql';
import {HomeModule} from './home/home.module';
import {UserModule} from './user/user.module';
import {MessageModule} from './message/message.module';
/*import {MetricsModule} from './metrics/metrics.module';*/

@Module({
	imports: [
		/*MetricsModule,*/
		DatabaseModule,
		AuthModule,
		UserModule,
		MessageModule,
		CatsModule,
		GraphQLModule.forRoot({
			include: [CatsModule],
			typePaths: ['./**/*.graphql'],
			introspection: true,
			playground: true,
			installSubscriptionHandlers: true,
			definitions: {
				path: join(process.cwd(), 'src/graphql.schema.ts'),
				outputAs: 'class'
			},
			path: '/graphiql'
		})
	]/*,
	providers: [AppGateway]*/
})
export class AppModule {
	private logger = new AppLogger(AppModule.name);

	constructor() {
		this.logger.log('Initialize');
	}
}
