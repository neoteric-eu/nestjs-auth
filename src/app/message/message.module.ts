import {HttpModule, Module} from '@nestjs/common';
import {DatabaseModule} from '../database/database.module';
import {HomeModule} from '../home/home.module';
import {UserModule} from '../user/user.module';
import {messageProviders} from './message.providers';
import {ConversationResolver} from './resolvers/conversation.resolver';
import {MessageResolver} from './resolvers/message.resolver';
import {UserConversationResolver} from './resolvers/user-conversation.resolver';
import {ConversationService} from './services/conversation.service';
import {MessageService} from './services/message.service';
import {SubscriptionsService} from './services/subscriptions.service';
import {UserConversationService} from './services/user-conversation.service';
import {MessageVoter} from './security/message.voter';


@Module({
	providers: [
		...messageProviders,
		MessageService,
		ConversationService,
		UserConversationService,
		MessageResolver,
		UserConversationResolver,
		ConversationResolver,
		SubscriptionsService,
		MessageVoter
	],
	imports: [HttpModule, DatabaseModule, UserModule, HomeModule],
	exports: [MessageService, ConversationService, UserConversationService, SubscriptionsService]
})
export class MessageModule {
}
