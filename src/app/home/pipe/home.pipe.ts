import {ArgumentMetadata, Injectable, PipeTransform} from '@nestjs/common';
import {HomeService} from '../home.service';
import {HomeEntity} from '../entity';

@Injectable()
export class HomePipe implements PipeTransform<any> {
	constructor(private readonly homeService: HomeService) {

	}
	async transform(homeId: string, metadata: ArgumentMetadata): Promise<HomeEntity> {
		return this.homeService.findOneById(homeId);
	}
}
