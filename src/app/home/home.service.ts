import { CrudService } from '../../base';
import { Injectable, Inject } from '@nestjs/common';
import { HomeEntity } from './entity';
import { HOME_TOKEN } from './home.constants';
import { Repository } from '../_helpers/database/repository.interface';

@Injectable()
export class HomeService extends CrudService<HomeEntity> {

	constructor(@Inject(HOME_TOKEN) protected readonly repository: Repository<HomeEntity>) {
		super();
	}
}
