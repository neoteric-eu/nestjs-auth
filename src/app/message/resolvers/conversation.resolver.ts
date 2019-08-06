import {Parent, ResolveProperty, Resolver} from '@nestjs/graphql';
import {HomeEntity} from '../../home/entity';
import {HomeService} from '../../home/home.service';
import {ConversationEntity} from '../entity';
import {Conversation} from '../../graphql.schema';
import {MessageService} from '../services/message.service';
import {User as CurrentUser} from '../../_helpers/graphql';
import {UserEntity as User} from '../../user/entity';
import {UserService} from '../../user/user.service';

@Resolver('Conversation')
export class ConversationResolver {
	constructor(
		private readonly messageService: MessageService,
		private readonly homeService: HomeService,
		private readonly userService: UserService
	) {
	}

	@ResolveProperty('messages')
	async getMessage(@CurrentUser() user: User, @Parent() conversation: ConversationEntity): Promise<any> {
		return this.messageService.findAll({
			where: {
				conversationId: {
					eq: conversation.id.toString()
				},
				deletedFor: {
					nin: [user.id.toString()]
				}
			},
			order: {
				createdAt: 'DESC'
			}
		});
	}

	@ResolveProperty('home')
	async getOwner(@Parent() conversation: ConversationEntity): Promise<HomeEntity> {
		try {
			return this.homeService.findOneById(conversation.homeId.toString());
		} catch (e) {
			return {} as any;
		}
	}

	@ResolveProperty('author')
	async getAuthor(@Parent() conversation: ConversationEntity): Promise<User> {
		try {
			return this.userService.findOneById(conversation.authorId);
		} catch (e) {
			return {} as User;
		}
	}
}
