import {CrudService} from '../../base';
import {Inject, Injectable} from '@nestjs/common';
import {HomeMediaEntity} from './entity';
import {HOME_MEDIA_TOKEN} from './home-media.constants';
import {Repository} from '../_helpers/database';

@Injectable()
export class HomeMediaService extends CrudService<HomeMediaEntity> {

	constructor(@Inject(HOME_MEDIA_TOKEN) protected readonly repository: Repository<HomeMediaEntity>) {
		super();
	}
}
