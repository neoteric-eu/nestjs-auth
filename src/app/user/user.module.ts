import {Module} from '@nestjs/common';
import {DatabaseModule} from '../database/database.module';
import {OnlineService} from './online.service';
import {UserSubscriptionService} from './user-subscription.service';
import {UserController} from './user.controller';
import {userProviders} from './user.providers';
import {UserService} from './user.service';
import {IsUserAlreadyExist} from './user.validator';
import {UserResolver} from './user.resolver';
import {UserCommand} from './user.command';

const PROVIDERS = [
	...userProviders,
	IsUserAlreadyExist,
	UserService,
	OnlineService,
	UserSubscriptionService,
	UserResolver,
	UserCommand
];

@Module({
	controllers: [UserController],
	providers: [...PROVIDERS],
	imports: [DatabaseModule],
	exports: [UserService, OnlineService]
})
export class UserModule {
}
