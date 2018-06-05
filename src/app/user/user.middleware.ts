import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';

@Injectable()
export class UserMiddleware implements NestMiddleware {
	resolve(): MiddlewareFunction {
		return async (req, res, next) => {
			console.log('Request ;)');
			next();
		};
	}
}
