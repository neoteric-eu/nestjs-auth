import * as crypto from 'crypto';
import {config} from '../../config';

export * from './entity';
export * from './filters';
export * from './database';
export * from './aws';
export * from './graphql';

export function passwordHash(password: string) {
	return crypto.createHmac('sha256', config.salt)
		.update(password)
		.digest('hex');
}
