import { Module } from '@nestjs/common';
import { HomeFavoriteService } from './home-favorite.service';
import { HomeFavoriteResolvers } from './home-favorite.resolvers';
import { homeFavoriteProviders } from './home-favorite.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
	providers: [...homeFavoriteProviders, HomeFavoriteService, HomeFavoriteResolvers],
	imports: [DatabaseModule],
	exports: [HomeFavoriteService]
})
export class HomeFavoriteModule {

}
