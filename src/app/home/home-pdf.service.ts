import {Inject, Injectable} from '@nestjs/common';
import {CrudService} from '../../base';
import {HomePdfEntity} from './entity';
import {HOME_PDF_TOKEN} from './home.constants';
import {Repository} from '../_helpers';
import {AppLogger} from '../app.logger';

@Injectable()
export class HomePdfService extends CrudService<HomePdfEntity> {

	private logger = new AppLogger(HomePdfService.name);

	constructor(
		@Inject(HOME_PDF_TOKEN) protected readonly repository: Repository<HomePdfEntity>
	) {
		super();
	}

}
