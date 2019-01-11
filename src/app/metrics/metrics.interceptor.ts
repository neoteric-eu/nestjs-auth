import { Injectable, NestInterceptor, ExecutionContext, HttpStatus, HttpException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { collectDefaultMetrics, Histogram } from 'prom-client';
import { Request, Response } from 'express';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {

	public readonly interval;
	private readonly duration: Histogram;
	private readonly duration_a: Histogram;

	constructor() {
		this.interval = collectDefaultMetrics();
		this.duration = new Histogram({
			name: 'http_request_duration_ms',
			help: 'Duration of HTTP requests in ms',
			labelNames: ['method', 'route', 'code'],
			// buckets for response time from 0.1ms to 500ms
			buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]
		});

		this.duration_a = new Histogram({
			name: 'ALERTS',
			help: 'Alert test',
			labelNames: ['alertname', 'label1', 'label2', 'instance']
		});
	}

	intercept(context: ExecutionContext, call$: Observable<any>): Observable<any> {
		const now = Date.now();
		console.log('Before...');
		const req = context.switchToHttp().getRequest<Request>();
		const res = context.switchToHttp().getResponse<Response>();
		return call$.pipe(
			tap(() => {
				const method = req.method;
				const route = req.route.path;
				const code = String(res.statusCode);
				this.duration
					.labels(method, route, code)
					.observe(Date.now() - now);
				console.log(`After... ${Date.now() - now}ms ${req.originalUrl}`);
			}),
			catchError(() => {
				const method = req.method;
				const route = req.route.path;
				const code = String(502);
				this.duration
					.labels(method, route, code)
					.observe(Date.now() - now);
				console.log(`After error... ${Date.now() - now}ms ${req.originalUrl}`);
				return throwError(new HttpException('Message', HttpStatus.BAD_GATEWAY));
			})
		);
	}
}
