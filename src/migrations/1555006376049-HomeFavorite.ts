import {getMongoManager, MigrationInterface, QueryRunner} from 'typeorm';
import {HomeFavoriteEntity} from '../app/home-favorite/entity';

export class HomeFavorite1555006376049 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const mm = getMongoManager();
		await mm.updateMany(HomeFavoriteEntity, {}, {$set: {isDeleted: false}});
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
	}

}
