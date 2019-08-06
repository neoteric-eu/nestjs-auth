import {forwardRef, HttpModule, Module} from '@nestjs/common';
import {ContractModule} from '../contract/contract.module';
import {DatabaseModule} from '../database/database.module';
import {HomeFavoriteModule} from '../home-favorite/home-favorite.module';
import {HomeMediaModule} from '../home-media/home-media.module';
import {UserModule} from '../user/user.module';
import {AttomDataApiService} from './attom-data-api.service';
import {FoxyaiService} from './foxyai.service';
import {HomePdfService} from './home-pdf.service';
import {HomeCommand} from './home.command';
import {HomeController} from './home.controller';
import {homeProviders} from './home.providers';
import {HomeResolver} from './home.resolver';
import {HomeService} from './home.service';
import {HomePipe} from './pipe/home.pipe';
import {HomeVoter} from './security/home.voter';

const PROVIDERS = [
	...homeProviders,
	HomeService,
	HomePdfService,
	HomeResolver,
	AttomDataApiService,
	FoxyaiService,
	HomeVoter,
	HomeCommand,
	HomePipe
];

const MODULES = [
	HttpModule,
	DatabaseModule,
	UserModule,
	HomeFavoriteModule,
	HomeMediaModule,
	forwardRef(() => ContractModule)
];

@Module({
	controllers: [HomeController],
	providers: [...PROVIDERS],
	imports: [...MODULES],
	exports: [HomeService]
})
export class HomeModule {

}
