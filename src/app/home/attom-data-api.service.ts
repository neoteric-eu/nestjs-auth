import {HttpService, Injectable} from '@nestjs/common';
import {config} from '../../config';

@Injectable()
export class AttomDataApiService {

	constructor(private httpService: HttpService) {
	}

	public async getAVMDetail({address1, address2}) {
		return this.httpService.get(`${config.homeApi.attomData.apiUrl}/attomavm/detail`, {
			params: {
				address1,
				address2
			},
			headers: {
				apiKey: config.homeApi.attomData.apiKey
			}
		}).toPromise();
	}
}
