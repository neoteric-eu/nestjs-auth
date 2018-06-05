import {Global, Module} from '@nestjs/common';
import {accessControlProviders} from './access-control.providers';
import {DatabaseModule} from '../database/database.module';
import {AccessControlController} from './access-control.controller';
import {AccessControlService} from './access-control.service';

@Global()
@Module({
	imports: [DatabaseModule],
	controllers: [AccessControlController],
	providers: [...accessControlProviders, AccessControlService],
	exports: [...accessControlProviders]
})
export class AccessControlModule {
}
