import {HttpModule, Module} from '@nestjs/common';
import {HomeService} from './home.service';
import {HomeResolver} from './home.resolver';
import {homeProviders} from './home.providers';
import {DatabaseModule} from '../database/database.module';
import {AttomDataApiService} from './attom-data-api.service';
import {UserModule} from '../user/user.module';
import {HomeMediaModule} from '../home-media/home-media.module';
import {HomeFavoriteModule} from '../home-favorite/home-favorite.module';

@Module({
	providers: [...homeProviders, HomeService, HomeResolver, AttomDataApiService],
	imports: [HttpModule, DatabaseModule, UserModule, HomeFavoriteModule, HomeMediaModule],
	exports: [HomeService]
})
export class HomeModule {

}
