import {Inject, Injectable} from '@nestjs/common';
import {MongoRepository} from 'typeorm';
import {CrudService} from '../../base';
import {HomeFavoriteEntity} from './entity';
import {HOME_FAVORITE_TOKEN} from './home-favorite.constants';

@Injectable()
export class HomeFavoriteService extends CrudService<HomeFavoriteEntity> {

	constructor(@Inject(HOME_FAVORITE_TOKEN) protected readonly repository: MongoRepository<HomeFavoriteEntity>) {
		super();
	}
}
