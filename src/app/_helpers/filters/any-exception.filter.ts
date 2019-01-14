import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const request = ctx.getRequest();
		const status = exception.getStatus();

		response
			.status(status)
			.json({
				statusCode: status,
				timestamp: new Date().toISOString(),
				path: request.url
			});
	}
}
