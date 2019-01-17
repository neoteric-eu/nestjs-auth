import {HttpModule, Module} from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeResolvers } from './home.resolvers';
import { homeProviders } from './home.providers';
import { DatabaseModule } from '../database/database.module';
import {AttomDataApiService} from './attom-data-api.service';

@Module({
	providers: [...homeProviders, HomeService, HomeResolvers, AttomDataApiService],
	imports: [DatabaseModule, HttpModule],
	exports: [HomeService]
})
export class HomeModule {

}
