import {HttpException, HttpStatus} from '@nestjs/common';

export interface RestExceptionResponse {
	error: string;
	message: string;
	condition: number;
}

export class RestException extends HttpException {
	constructor(response: RestExceptionResponse, status: number = HttpStatus.BAD_REQUEST) {
		super(response, status);
	}
}
