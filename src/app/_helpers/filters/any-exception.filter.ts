import {ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus} from '@nestjs/common';

@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		let status = HttpStatus.BAD_REQUEST;

		if (typeof exception === 'string') {
			exception = new HttpException({error: 'Undefined', message: exception}, status);
		}

		if (exception.getStatus) {
			status = exception.getStatus();
		}

		response
			.status(status)
			.json({
				statusCode: status,
				...exception.getResponse() as object,
				timestamp: new Date().toISOString()
			});
	}
}
