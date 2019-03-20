import {CrudService} from '../../base';
import {Inject, Injectable} from '@nestjs/common';
import {HomeFavoriteEntity} from './entity';
import {HOME_FAVORITE_TOKEN} from './home-favorite.constants';
import {Repository} from 'typeorm';

@Injectable()
export class HomeFavoriteService extends CrudService<HomeFavoriteEntity> {

	constructor(@Inject(HOME_FAVORITE_TOKEN) protected readonly repository: Repository<HomeFavoriteEntity>) {
		super();
	}
}
