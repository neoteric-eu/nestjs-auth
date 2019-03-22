import {Inject, Injectable} from '@nestjs/common';
import {MongoRepository, Repository} from 'typeorm';
import {CrudService} from '../../base';
import {HomePdfEntity} from './entity';
import {HOME_PDF_TOKEN} from './home.constants';
import {AppLogger} from '../app.logger';

@Injectable()
export class HomePdfService extends CrudService<HomePdfEntity> {

	private logger = new AppLogger(HomePdfService.name);

	constructor(
		@Inject(HOME_PDF_TOKEN) protected readonly repository: MongoRepository<HomePdfEntity>
	) {
		super();
	}

}
