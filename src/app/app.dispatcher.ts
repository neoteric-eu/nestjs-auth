import * as cors from 'cors';
import * as helmet from 'helmet';
import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {INestApplication, INestMicroservice} from '@nestjs/common';
import {config} from '../config';
import {AppModule} from './app.module';
import {AppLogger} from './app.logger';
import {useContainer} from 'class-validator';
import { MetricsInterceptor } from './metrics/metrics.interceptor';
import { AnyExceptionFilter } from './_helpers';

export class AppDispatcher {
	private app: INestApplication;
	private microservice: INestMicroservice;
	private logger = new AppLogger(AppDispatcher.name);
	private metrics = new MetricsInterceptor();

	async dispatch(): Promise<void> {
		await this.createServer();
		this.createMicroServices();
		await this.startMicroservices();
		return this.startServer();
	}

	async shutdown(): Promise<void> {
		clearInterval(this.metrics.interval);
		await this.app.close();
	}

	private async createServer(): Promise<void> {
		this.app = await NestFactory.create(AppModule, {
			logger: new AppLogger('Nest')
		});
		useContainer(this.app, {fallbackOnErrors: true});
		this.app.use(cors());
		this.app.useGlobalInterceptors(this.metrics);
		this.app.useGlobalFilters(new AnyExceptionFilter());
		if (config.isProduction) {
			this.app.use(helmet());
		}
		const options = new DocumentBuilder()
			.setTitle(config.name)
			.setDescription(config.description)
			.setVersion(config.version)
			.addBearerAuth()
			.build();

		const document = SwaggerModule.createDocument(this.app, options);
		SwaggerModule.setup('/swagger', this.app, document);
		this.logger.log(`Swagger is exposed at ${config.host}:${config.port}/swagger`);
	}

	private createMicroServices(): void {
		this.microservice = this.app.connectMicroservice(config.microservice);
	}

	private startMicroservices(): Promise<void> {
		return this.app.startAllMicroservicesAsync();
	}

	private async startServer(): Promise<void> {
		await this.app.listen(config.port, config.host);
		this.logger.log(`Server is listening ${config.host}:${config.port}`);
	}
}
