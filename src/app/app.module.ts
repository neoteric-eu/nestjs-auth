import {Module} from '@nestjs/common';
import {join} from 'path';
import {AuthModule} from './auth/auth.module';
import {AppLogger} from './app.logger';
import {DatabaseModule} from './database/database.module';
import {GraphQLModule} from '@nestjs/graphql';
import {HomeModule} from './home/home.module';
import {UserModule} from './user/user.module';
import {MessageModule} from './message/message.module';
import {HomeFavoriteModule} from './homeFavorite/home-favorite.module';

@Module({
	imports: [
		DatabaseModule,
		AuthModule,
		UserModule,
		HomeModule,
		HomeFavoriteModule,
		MessageModule,
		GraphQLModule.forRoot({
			include: [HomeModule, UserModule, HomeFavoriteModule],
			typePaths: ['./**/*.graphql'],
			introspection: true,
			playground: true,
			installSubscriptionHandlers: true,
			definitions: {
				path: join(process.cwd(), 'src/app/graphql.schema.ts'),
				outputAs: 'class'
			}
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
