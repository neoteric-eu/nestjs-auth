import {readFileSync} from 'fs';
import {MicroserviceOptions, Transport} from '@nestjs/microservices';
import {ConnectionOptions} from 'typeorm';

const appPackage = readFileSync(`${__dirname}/../../package.json`, {
	encoding: 'utf8'
});
const appData = JSON.parse(appPackage);

interface Config {
	appRootPath: string;
	version: string;
	name: string;
	description: string;
	uuid: string;
	isProduction: boolean;
	salt: string;
	passwordMinLength: number;
	assetsPath: string;
	mobile: {
		schema: string;
		host: string;
	};
	mail: {
		from: string
	};
	database: ConnectionOptions;
	session: {
		domain: string;
		secret: string;
		timeout: number;
		refresh: {
			secret: string;
			timeout: number;
		};
		password_reset: {
			secret: string;
			timeout: number;
		};
		verify: {
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
		foxyai: {
			apiUrl: string;
			apiKey: string;
		};
	};
	googleApi: {
		apiUrl: string;
		apiKey: string;
	};
	firebase: {
		type: string;
		project_id: string;
		private_key_id: string;
		private_key: string;
		client_email: string;
		client_id: string;
		auth_uri: string;
		token_uri: string;
		auth_provider_x509_cert_url: string;
		client_x509_cert_url: string;
	};
	aws: {
		api_key: string;
		secret_key: string;
		region: string;
		s3: {
			bucket_name: string
		};
		pinpoint: {
			smtp: {
				host: string;
				port: number;
				user: string;
				secret: string;
			}
		};
	};
	api2pdf: {
		apiKey: string
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
	appRootPath: `${__dirname}/../app`,
	version: appData.version,
	name: appData.name,
	description: appData.description,
	uuid: process.env.APP_UUID,
	isProduction: process.env.NODE_ENV === 'production',
	salt: process.env.APP_SALT,
	passwordMinLength: 7,
	assetsPath: `${__dirname}/../assets`,
	mobile: {
		schema: 'https',
		host: 'mobile.ava.home'
	},
	mail: {
		from: process.env.APP_MAIL_FROM
	},
	database: {
		type: 'mongodb',
		url: process.env.APP_DATABASE_SECRET_URL,
		// synchronize: true,
		logging: 'all',
		useNewUrlParser: true,
		migrationsRun: true,
		migrations: [
			__dirname + '/../migrations/*{.ts,.js}'
		],
		entities: [
			__dirname + '/../**/entity/*.entity{.ts,.js}'
		]
	},
	session: {
		domain: process.env.APP_SESSION_DOMAIN,
		secret: process.env.APP_SESSION_SECRET,
		timeout: parseInt(process.env.APP_SESSION_TIMEOUT, 10),
		refresh: {
			secret: process.env.APP_SESSION_REFRESH_SECRET,
			timeout: parseInt(process.env.APP_SESSION_REFRESH_TIMEOUT, 10)
		},
		password_reset: {
			secret: process.env.APP_SESSION_PASSWORD_RESET_SECRET,
			timeout: parseInt(process.env.APP_SESSION_PASSWORD_RESET_TIMEOUT, 10)
		},
		verify: {
			secret: process.env.APP_SESSION_VERIFY_SECRET,
			timeout: parseInt(process.env.APP_SESSION_VERIFY_TIMEOUT, 10)
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
		},
		foxyai: {
			apiKey: process.env.APP_HOME_API_FOXYAI_API_KEY,
			apiUrl: 'http://api.foxyai.com'
		}
	},
	googleApi: {
		apiKey: process.env.APP_GOOGLE_API_SECRET,
		apiUrl: 'https://maps.googleapis.com/maps/api/geocode/json'
	},
	firebase: JSON.parse(process.env.APP_FIREBASE_SECRET),
	aws: {
		api_key: process.env.APP_AWS_API_KEY,
		secret_key: process.env.APP_AWS_SECRET_KEY,
		region: process.env.APP_AWS_REGION,
		s3: {
			bucket_name: process.env.APP_AWS_S3_BUCKET_NAME
		},
		pinpoint: {
			smtp: {
				host: process.env.APP_AWS_PINPOINT_SMTP_HOST,
				port: parseInt(process.env.APP_AWS_PINPOINT_SMTP_PORT, 10),
				user: process.env.APP_AWS_PINPOINT_SMTP_USER,
				secret: process.env.APP_AWS_PINPOINT_SMTP_SECRET
			}
		}
	},
	api2pdf: {
		apiKey: process.env.APP_API2PDF_SECRET
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
