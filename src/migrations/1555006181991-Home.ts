import {getMongoManager, MigrationInterface, QueryRunner} from 'typeorm';
import {HomeEntity} from '../app/home/entity';

export class Home1555006181991 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const mm = getMongoManager();
		await mm.updateMany(HomeEntity, {}, {$set: {isDeleted: false}});
	}


	public async down(queryRunner: QueryRunner): Promise<any> {
	}

}
