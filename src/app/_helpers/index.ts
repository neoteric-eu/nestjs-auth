import * as crypto from 'crypto';
import {config} from '../../config';

export * from './entity/extended-entity';
export * from './filters/any-exception.filter';
export * from './database/repository.interface';
export * from './database/deep-partial';
export * from './aws/dynamo.repository';

export function passwordHash(password: string) {
	return crypto.createHmac('sha256', config.salt)
		.update(password)
		.digest('hex');
}
