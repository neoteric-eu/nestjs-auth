import {HttpModule, Module} from '@nestjs/common';
import {DatabaseModule} from '../database/database.module';
import {messageProviders} from './message.providers';
import {MessageService} from './services/message.service';
import {MessageResolvers} from './resolvers/message.resolvers';
import {ConversationService} from './services/conversation.service';
import {UserConversationService} from './services/user-conversation.service';
import {UserModule} from '../user/user.module';
import {UserConversationResolvers} from './resolvers/user-conversation.resolvers';
import {ConversationResolvers} from './resolvers/conversation.resolvers';


@Module({
	providers: [
		...messageProviders,
		MessageService,
		ConversationService,
		UserConversationService,
		MessageResolvers,
		UserConversationResolvers,
		ConversationResolvers],
	imports: [HttpModule, DatabaseModule, UserModule],
	exports: [MessageService, ConversationService, UserConversationService]
})
export class MessageModule {
}
