import {HttpException, HttpStatus} from '@nestjs/common';

export class DynamoException extends HttpException {
	constructor(message: string, error = 'Database') {
		super({message, error}, HttpStatus.NOT_FOUND);
	}
}
