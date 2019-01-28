import {HttpModule, Module} from '@nestjs/common';
import {DatabaseModule} from '../database/database.module';
import {messageProviders} from './message.providers';
import {MessageService} from './message.service';
import {MessageResolvers} from './message.resolvers';


@Module({
	providers: [...messageProviders, MessageService, MessageResolvers],
	imports: [HttpModule, DatabaseModule],
	exports: [MessageService]
})
export class MessageModule {
}
