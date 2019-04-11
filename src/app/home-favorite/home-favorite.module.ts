import {forwardRef, Module} from '@nestjs/common';
import {HomeModule} from '../home/home.module';
import {HomeFavoriteService} from './home-favorite.service';
import {HomeFavoriteResolver} from './home-favorite.resolver';
import {homeFavoriteProviders} from './home-favorite.providers';
import {DatabaseModule} from '../database/database.module';
import {HomeFavoriteController} from './home-favorite.controller';

@Module({
	controllers: [HomeFavoriteController],
	providers: [...homeFavoriteProviders, HomeFavoriteService, HomeFavoriteResolver],
	imports: [DatabaseModule, forwardRef(() => HomeModule)],
	exports: [HomeFavoriteService]
})
export class HomeFavoriteModule {

}
