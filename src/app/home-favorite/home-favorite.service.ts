import { CrudService } from '../../base';
import { Injectable, Inject } from '@nestjs/common';
import { HomeFavoriteEntity } from './entity';
import { HOME_FAVORITE_TOKEN } from './home-favorite.constants';
import { Repository } from '../_helpers/database/repository.interface';

@Injectable()
export class HomeFavoriteService extends CrudService<HomeFavoriteEntity> {

	constructor(@Inject(HOME_FAVORITE_TOKEN) protected readonly repository: Repository<HomeFavoriteEntity>) {
		super();
	}
}
