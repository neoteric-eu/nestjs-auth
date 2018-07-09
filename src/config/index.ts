import {readFileSync} from 'fs';
import { ConnectionOptions } from 'typeorm';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';

const appPackage = readFileSync(`${__dirname}/../../package.json`, {
	encoding: 'utf8'
});
const appData = JSON.parse(appPackage);

interface Config {
	version: string;
	name: string;
	description: string;
	uuid: string;
	isProduction: boolean;
	salt: string;
	session: {
		domain: string;
		secret: string;
		timeout: number;
	};
	port: number;
	host: string;
	microservice: MicroserviceOptions;
	database: ConnectionOptions;
	logger: {
		level: string;
		transports?: any[];
	};
	cache: {
		host: string;
		port: number;
	};
	validator: {
		validationError: {
			target: boolean;
			value: boolean;
		}
	};
}

export const config: Config = {
	version: appData.version,
	name: appData.name,
	description: appData.description,
	uuid: process.env.APP_UUID,
	isProduction: process.env.NODE_ENV === 'production',
	salt: process.env.APP_SALT,
	session: {
		domain: process.env.APP_SESSION_DOMAIN,
		secret: process.env.APP_SESSION_SECRET,
		timeout: parseInt(process.env.APP_SESSION_TIMEOUT, 10)
	},
	port: parseInt(process.env.APP_PORT, 10),
	host: process.env.APP_HOST,
	microservice: {
		transport: Transport.NATS,
		options: {
			url: process.env.APP_MESSAGE_SYSTEM_URL
		}
	},
	database: {
		type: process.env.APP_DATABASE_TYPE as any,
		host: process.env.APP_DATABASE_HOST,
		port: parseInt(process.env.APP_DATABASE_PORT, 10),
		username: process.env.APP_DATABASE_USER,
		password: process.env.APP_DATABASE_PASSWORD,
		database: process.env.APP_DATABASE_NAME,
		synchronize: process.env.NODE_ENV !== 'production',
		entities: [
			__dirname + '/../**/entity/*.entity{.ts,.js}'
		],
		logging: process.env.APP_DATABASE_LOGGING as LoggerOptions
	},
	logger: {
		level: process.env.APP_LOGGER_LEVEL
	},
	cache: {
		host: process.env.APP_CACHE_HOST,
		port: parseInt(process.env.APP_CACHE_PORT, 10)
	},
	validator: {
		validationError: {
			target: false,
			value: false
		}
	}
};
