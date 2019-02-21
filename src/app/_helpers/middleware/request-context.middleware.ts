import {Injectable, MiddlewareFunction, NestMiddleware} from '@nestjs/common';
import cls from 'cls-hooked';
import {RequestContext} from '../request-context';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
	resolve(): MiddlewareFunction {
		return(req, res, next) => {
			const requestContext = new RequestContext(req, res);
			const session = cls.getNamespace(RequestContext.nsid) || cls.createNamespace(RequestContext.nsid);

			session.run(async () => {
				session.set(RequestContext.name, requestContext);
				next();
			});
		};
	}
}
