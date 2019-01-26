import {INestApplication, INestMicroservice} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {useContainer} from 'class-validator';
import cors from 'cors';
import helmet from 'helmet';
import query from 'qs-middleware';
import {config} from '../config';
import {AppLogger} from './app.logger';
import {AppModule} from './app.module';

export class AppDispatcher {
	private app: INestApplication;
	private microservice: INestMicroservice;
	private logger = new AppLogger(AppDispatcher.name);

	async dispatch(): Promise<void> {
		await this.createServer();
		this.createMicroServices();
		await this.startMicroservices();
		return this.startServer();
	}

	async shutdown(): Promise<void> {
		await this.app.close();
	}

	private async createServer(): Promise<void> {
		this.app = await NestFactory.create(AppModule, {
			logger: new AppLogger('Nest')
		});
		useContainer(this.app, {fallbackOnErrors: true});
		this.app.use(cors());
		this.app.use(query());
		// this.app.useGlobalFilters(new AnyExceptionFilter());
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
		document.paths['/graphql'] = {get: { tags: ['graphql']}, post: { tags: ['graphql']}};
		SwaggerModule.setup('/swagger', this.app, document);
	}

	private createMicroServices(): void {
		this.microservice = this.app.connectMicroservice(config.microservice);
	}

	private startMicroservices(): Promise<void> {
		return this.app.startAllMicroservicesAsync();
	}

	private async startServer(): Promise<void> {
		await this.app.listen(config.port, config.host);
		this.logger.log(`Swagger is exposed at http://${config.host}:${config.port}/swagger`);
		this.logger.log(`Graphql is exposed at http://${config.host}:${config.port}/graphql`);
		this.logger.log(`Server is listening http://${config.host}:${config.port}`);
	}
}
