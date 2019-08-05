import {CrudService} from '../../../base';
import {Inject, Injectable} from '@nestjs/common';
import {MongoRepository} from 'typeorm';
import {USER_CONVERSATION_TOKEN} from '../message.constants';
import {UserConversationEntity} from '../entity';
import {ConversationService} from './conversation.service';
import {UserEntity} from '../../user/entity';
import {CreateConversationInput} from '../../graphql.schema';

@Injectable()
export class UserConversationService extends CrudService<UserConversationEntity> {

	constructor(
		@Inject(USER_CONVERSATION_TOKEN) protected readonly repository: MongoRepository<UserConversationEntity>,
		private readonly conversationService: ConversationService
	) {
		super();
	}

	public async createConversationIfMissing(user: UserEntity, input: CreateConversationInput): Promise<[UserConversationEntity, boolean]> {
		const allConversations = await this.findAll({
			where: {
				userId: {eq: user.id.toString()}
			}
		});

		const existingConversation = await this.findOne({
			where: {
				userId: {
					eq: input.recipientId
				},
				conversationId: {
					in: allConversations.map(con => con.id)
				}
			}
		});

		if (!existingConversation) {
			const createdConversation = await this.createConversation(user, input);
			return [createdConversation, true];
		}

		const userConversation = allConversations.find(conversation => conversation.conversationId === existingConversation.conversationId);

		if (userConversation.isDeleted) {
			userConversation.isDeleted = false;
			await this.update(userConversation);
		}

		if (existingConversation.isDeleted) {
			existingConversation.isDeleted = false;
			await this.update(existingConversation);
		}

		return [userConversation, false];
	}

	private async createConversation(user: UserEntity, input: CreateConversationInput): Promise<UserConversationEntity> {
		const createdConversation = await this.conversationService.create({
			...input, authorId: user.id.toString()
		});

		const createdAuthorConversation = await this.create({
			userId: user.id.toString(),
			conversationId: createdConversation.id.toString()
		});
		await this.create({
			userId: input.recipientId.toString(),
			conversationId: createdConversation.id.toString()
		});
		return createdAuthorConversation;
	}
}
