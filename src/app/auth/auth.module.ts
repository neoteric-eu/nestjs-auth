import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {JwtStrategy} from './jwt.strategy';
import {AuthController} from './auth.controller';
import {UserModule} from '../user/user.module';
import {DatabaseModule} from '../database/database.module';
import {FacebookTokenStrategy} from './facebook-token.strategy';

@Module({
	imports: [UserModule, DatabaseModule],
	providers: [AuthService, JwtStrategy, FacebookTokenStrategy],
	controllers: [AuthController]
})
export class AuthModule {
}
