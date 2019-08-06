import {HttpService, Injectable} from '@nestjs/common';
import {AxiosResponse} from 'axios';
import {plainToClass} from 'class-transformer';
import {get} from 'lodash';
import {map} from 'rxjs/operators';
import {config} from '../../config';
import {AppLogger} from '../app.logger';
import {ConditionScoreDto} from './dto/condition-score.dto';

@Injectable()
export class FoxyaiService {

	private logger = new AppLogger(FoxyaiService.name);

	constructor(private httpService: HttpService) {
	}

	public async propertyConditionScore(urls: Array<string>): Promise<ConditionScoreDto> {
		try {
			return await this.httpService.post(`${config.homeApi.foxyai.apiUrl}/property_condition_score`, {
				key: config.homeApi.foxyai.apiKey,
				urls
			}).pipe(map((response: AxiosResponse) => plainToClass(ConditionScoreDto, {
					bathrooms: get(response, 'data.property_condition_score.Bathrooms'),
					exterior: get(response, 'data.property_condition_score.Exterior'),
					interior: get(response, 'data.property_condition_score.Interior'),
					kitchen: get(response, 'data.property_condition_score[Kitchen/Dining]'),
					overall: get(response, 'data.property_condition_score.Overall')
				}, {strategy: 'excludeAll'})
			)).toPromise();
		} catch (e) {
			this.logger.error(e.message, e.trace);
		}
	}
}

