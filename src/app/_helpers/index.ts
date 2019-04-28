import * as crypto from 'crypto';
import {config} from '../../config';

export * from './entity';
export * from './filters';
export * from './database';
export * from './graphql';
export * from './rest.exception';
export * from './request-context';
export * from './middleware/request-context.middleware';

export function ucfirst(string) {
	return string[0].toUpperCase() + string.slice(1);
}

export function passwordHash(password: string) {
	return crypto.createHmac('sha256', config.salt)
		.update(password, 'utf8')
		.digest('hex');
}
