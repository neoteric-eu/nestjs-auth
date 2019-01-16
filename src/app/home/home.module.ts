import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeResolvers } from './home.resolvers';
import { homeProviders } from './home.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
	providers: [...homeProviders, HomeService, HomeResolvers],
	imports: [DatabaseModule],
	exports: [HomeService]
})
export class HomeModule {

}
