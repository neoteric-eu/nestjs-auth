import {HttpModule, Module} from '@nestjs/common';
import {DatabaseModule} from '../database/database.module';
import {messageProviders} from './message.providers';
import {MessageService} from './services/message.service';
import {MessageResolver} from './resolvers/message.resolver';
import {ConversationService} from './services/conversation.service';
import {UserConversationService} from './services/user-conversation.service';
import {UserModule} from '../user/user.module';
import {UserConversationResolver} from './resolvers/user-conversation.resolver';
import {ConversationResolver} from './resolvers/conversation.resolver';
import {SubscriptionsService} from './services/subscriptions.service';


@Module({
	providers: [
		...messageProviders,
		MessageService,
		ConversationService,
		UserConversationService,
		MessageResolver,
		UserConversationResolver,
		ConversationResolver,
		SubscriptionsService
	],
	imports: [HttpModule, DatabaseModule, UserModule],
	exports: [MessageService, ConversationService, UserConversationService, SubscriptionsService]
})
export class MessageModule {
}
