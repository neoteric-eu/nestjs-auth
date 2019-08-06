import {Module} from '@nestjs/common';
import {DatabaseModule} from '../database/database.module';
import {homeMediaProviders} from './home-media.providers';
import {HomeMediaService} from './home-media.service';
import {HomeMediaResolver} from './home-media.resolver';
import {HomeMediaController} from './home-media.controller';

@Module({
	controllers: [HomeMediaController],
	providers: [...homeMediaProviders, HomeMediaService, HomeMediaResolver],
	imports: [DatabaseModule],
	exports: [HomeMediaService]
})
export class HomeMediaModule {

}
