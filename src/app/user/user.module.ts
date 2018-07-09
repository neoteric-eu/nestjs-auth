import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserController } from './user.controller';
import { userProviders } from './user.providers';
import { UserService } from './user.service';
import { IsUserAlreadyExist } from './user.validator';

@Module({
	controllers: [UserController],
	providers: [...userProviders, IsUserAlreadyExist, UserService],
	imports: [DatabaseModule],
	exports: [UserService]
})
export class UserModule {
}
