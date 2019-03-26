import {Module} from '@nestjs/common';
import {HomeFavoriteService} from './home-favorite.service';
import {HomeFavoriteResolver} from './home-favorite.resolver';
import {homeFavoriteProviders} from './home-favorite.providers';
import {DatabaseModule} from '../database/database.module';
import {HomeFavoriteController} from './home-favorite.controller';

@Module({
	controllers: [HomeFavoriteController],
	providers: [...homeFavoriteProviders, HomeFavoriteService, HomeFavoriteResolver],
	imports: [DatabaseModule],
	exports: [HomeFavoriteService]
})
export class HomeFavoriteModule {

}
