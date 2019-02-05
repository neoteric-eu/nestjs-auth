import {Module} from '@nestjs/common';
import {DatabaseModule} from '../database/database.module';
import {UserController} from './user.controller';
import {userProviders} from './user.providers';
import {UserService} from './user.service';
import {IsUserAlreadyExist} from './user.validator';
import {UserResolver} from './user.resolver';
import {UserCommand} from './user.command';

@Module({
	controllers: [UserController],
	providers: [...userProviders, IsUserAlreadyExist, UserService, UserResolver, UserCommand],
	imports: [DatabaseModule],
	exports: [UserService]
})
export class UserModule {
}
