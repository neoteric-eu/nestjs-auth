import {getMongoManager, MigrationInterface, QueryRunner} from 'typeorm';
import {UserConversationEntity} from '../app/message/entity';

export class UserConversation1554826342372 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const mm = getMongoManager();
		await mm.updateMany(UserConversationEntity, {}, {$set: {isDeleted: false}});
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
	}

}
