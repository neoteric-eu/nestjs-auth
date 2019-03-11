import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus} from '@nestjs/common';
import {AppLogger} from '../../app.logger';
import {TwingError, TwingErrorLoader} from 'twing';

@Catch(TwingErrorLoader)
export class TwigExceptionFilter implements ExceptionFilter {
	private logger = new AppLogger(TwingErrorLoader.name);

	catch(exception: TwingError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		this.logger.error(`[${exception.name}] ${exception.message}`, exception.stack);

		response
			.status(status)
			.json({
				statusCode: HttpStatus.NOT_FOUND,
				error: 'Template',
				message: 'Template not found',
				timestamp: new Date().toISOString()
			});
	}
}
