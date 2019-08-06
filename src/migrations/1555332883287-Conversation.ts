import {getMongoManager, MigrationInterface, QueryRunner} from 'typeorm';
import {ConversationEntity, UserConversationEntity} from '../app/message/entity';
import {ObjectId} from 'mongodb';

export class Conversation1555332883287 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const mm = getMongoManager();
		const userConversations = await mm.find(UserConversationEntity, {});
		const checkedConversations = [];

		for (const userConversation of userConversations) {
			const isUserConversationChecked = checkedConversations
				.find(checkedConversationId => userConversation.conversationId === checkedConversationId);

			if (!isUserConversationChecked) {
				const secondUserConversation = userConversations
					.find(conversation => {
						return userConversation.conversationId === conversation.conversationId && userConversation.userId !== conversation.userId;
					});

				const authorId = userConversation.createdAt.valueOf() < secondUserConversation.createdAt.valueOf() ?
					userConversation.userId : secondUserConversation.userId;

				await mm.updateOne(ConversationEntity, { _id: new ObjectId(userConversation.conversationId) }, {$set: {authorId}});

				checkedConversations.push(userConversation.conversationId);
			}
		}
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
	}
}
