import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { DateTime } from 'luxon';
import { config } from '../config';
import { LoggerInstance } from 'winston';
import { Logger, QueryRunner } from 'typeorm';

export class AppLogger implements LoggerService {
	private logger: LoggerInstance;

	constructor(label?: string) {
		this.logger = new winston.Logger({
			level: config.logger.level,
			transports: [
				new winston.transports.Console({
					label,
					timestamp: () => DateTime.local().toString(),
					formatter: options => `${options.timestamp()} [${options.level.toUpperCase()}] ${options.label} - ${options.message}`
				})
			]
		});
	}

	error(message: string, trace: string) {
		this.logger.error(message, trace);
	}

	warn(message: string) {
		this.logger.warn(message);
	}

	log(message: string) {
		this.logger.info(message);
	}

	verbose(message: string) {
		this.logger.verbose(message);
	}

	debug(message: string) {
		this.logger.debug(message);
	}

	silly(message: string) {
		this.logger.silly(message);
	}
}

export class AppQueryLogger extends AppLogger implements Logger {
	constructor() {
		super('TypeOrm');
	}

	logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
		super.debug(`[QUERY] ${query} ${parameters ? ' - ' + parameters : ''}`);
	}

	logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
		super.error(error, query);
	}

	logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
		super.log(`[SLOW_QUERY] [${time}] ${query}`);
	}

	logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
		super.log(message);
	}

	logMigration(message: string, queryRunner?: QueryRunner): any {
		super.log(message);
	}

	log(level: any, message?: any, queryRunner?: QueryRunner): any {
		super.log(message);
	}

}
