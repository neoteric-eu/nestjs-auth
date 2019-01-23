import {readFileSync} from 'fs';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

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
		refresh: {
			secret: string;
			timeout: number;
		}
	};
	facebook: {
		app_id: string;
		app_secret: string;
	};
	homeApi: {
		attomData: {
			apiUrl: string;
			apiKey: string;
		};
	};
	aws: {
		api_key: string;
		secret_key: string;
		region: string;
		s3: {
			bucket_name: string
		};
	};
	port: number;
	host: string;
	microservice: MicroserviceOptions;
	logger: {
		level: string;
		transports?: any[];
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
		timeout: parseInt(process.env.APP_SESSION_TIMEOUT, 10),
		refresh: {
			secret: process.env.APP_SESSION_REFRESH_SECRET,
			timeout: parseInt(process.env.APP_SESSION_REFRESH_TIMEOUT, 10)
		}
	},
	facebook: {
		app_id: process.env.APP_FACEBOOK_APP_ID,
		app_secret: process.env.APP_FACEBOOK_APP_SECRET
	},
	homeApi: {
		attomData: {
			apiKey: process.env.APP_HOME_API_ATTOM_DATA_API_KEY,
			apiUrl: 'https://search.onboard-apis.com/propertyapi/v1.0.0'
		}
	},
	aws: {
		api_key: process.env.APP_AWS_API_KEY,
		secret_key: process.env.APP_AWS_SECRET_KEY,
		region: process.env.APP_AWS_REGION,
		s3: {
			bucket_name: process.env.APP_AWS_S3_BUCKET_NAME
		}
	},
	port: parseInt(process.env.APP_PORT, 10),
	host: process.env.APP_HOST,
	microservice: {
		transport: Transport.TCP
	},
	logger: {
		level: process.env.APP_LOGGER_LEVEL
	},
	validator: {
		validationError: {
			target: false,
			value: false
		}
	}
};
