import {HttpException, HttpService, HttpStatus, Injectable} from '@nestjs/common';
import {config} from '../../config';
import {AppLogger} from '../app.logger';
import {PropertyApi} from './attom/property-api';
import {HomeErrorEnum} from './home-error.enum';

@Injectable()
export class AttomDataApiService {

	private logger = new AppLogger(AttomDataApiService.name);

	constructor(private httpService: HttpService) {
	}

	public async getAVMDetail({address1, address2}) {
		try {
			return await this.httpService.get(`${config.homeApi.attomData.apiUrl}/avm/detail`, {
				params: {
					address1,
					address2
				},
				headers: {
					apiKey: config.homeApi.attomData.apiKey
				}
			}).toPromise();
		} catch (e) {
			if (e.response.status === 403) {
				this.handleAttomError(e.response.data.Response.status);
			} else {
				this.handleAttomError(e.response.data.status);
			}
		}
	}

	public async getDetailWithSchools({id}) {
		try {
			return await this.httpService.get(`${config.homeApi.attomData.apiUrl}/property/detailwithschools`, {
				params: {
					id
				},
				headers: {
					apiKey: config.homeApi.attomData.apiKey
				}
			}).toPromise();
		} catch (e) {
			this.handleAttomError(e.response);
		}
	}

	public async getSchoolDetail({id}) {
		try {
			return await this.httpService.get(`${config.homeApi.attomData.apiUrl}/school/detail`, {
				params: {
					id
				},
				headers: {
					apiKey: config.homeApi.attomData.apiKey
				}
			}).toPromise();
		} catch (e) {
			this.handleAttomError(e.response);
		}
	}

	public async getLocation({address}) {
		try {
			return await this.httpService.get(config.googleApi.apiUrl, {
				params: {
					address,
					key: config.googleApi.apiKey
				}
			}).toPromise();
		} catch (e) {
			this.logger.error(e.message, e.stack);
		}
	}

	private handleAttomError(status) {
		let statuscode = PropertyApi.STATUS_CODES['' + status.code];

		if (!statuscode) {
			statuscode = {
				message: 'Undefined error'
			};
		}
		if (!statuscode.condition) {
			statuscode.condition = HomeErrorEnum.ATTOM_DEFAULT_API_ERROR;
			this.logger.warn(`Missing condition for status ${status.code}, use default as ATTOM_API_ERROR ${statuscode.condition}`);
		}

		this.logger.warn(`[handleAttomError] ${statuscode.name}`);

		throw new HttpException({
			error: 'Home',
			condition: statuscode.condition,
			message: statuscode.message
		}, HttpStatus.BAD_REQUEST);
	}
}

