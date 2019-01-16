import jwt from 'jsonwebtoken';
import {UserEntity} from '../../user/entity';
import {config} from '../../../config';

export async function createToken(user: UserEntity) {
	const expiresIn = 60 * 60;
	const accessToken = jwt.sign({id: user.id}, config.session.secret, {
		expiresIn,
		audience: config.session.domain,
		issuer: config.uuid
	});
	return {
		expiresIn,
		accessToken
	};
}

export async function verifyToken(token: string) {
	return new Promise(resolve => {
		jwt.verify(token, config.session.secret, decoded => resolve(decoded));
	});
}
