import {JsonWebTokenError, sign, verify} from 'jsonwebtoken';
import {DeepPartial} from '../../_helpers/database';
import {UserEntity} from '../../user/entity';
import {config} from '../../../config';
import {TokenDto} from '../dto/token.dto';

export async function createAuthToken({id}: DeepPartial<UserEntity>) {
	const expiresIn = config.session.timeout;
	const accessToken = createToken(id, expiresIn, config.session.secret);
	const refreshToken = createToken(id, config.session.refresh.timeout, config.session.refresh.secret);
	return {
		expiresIn,
		accessToken,
		refreshToken
	};
}

export function createToken(id, expiresIn, secret) {
	return sign({id}, secret, {
		expiresIn,
		audience: config.session.domain,
		issuer: config.uuid
	});
}

export async function verifyToken(token: string, secret: string): Promise<TokenDto> {
	return new Promise((resolve, reject) => {
		verify(token, secret, (err, decoded) => {
			if (decoded instanceof JsonWebTokenError) {
				return reject(decoded);
			}
			resolve(decoded as TokenDto);
		});
	});
}
