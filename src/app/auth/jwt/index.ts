import {JsonWebTokenError, sign, verify} from 'jsonwebtoken';
import {DeepPartial} from '../../_helpers/database';
import {UserEntity} from '../../user/entity';
import {config} from '../../../config';
import {TokenDto} from '../dto/token.dto';

export async function createToken({id}: DeepPartial<UserEntity>) {
	const expiresIn = config.session.timeout;
	const accessToken = sign({id}, config.session.secret, {
		expiresIn,
		audience: config.session.domain,
		issuer: config.uuid
	});
	const refreshToken = sign({id}, config.session.refresh.secret, {
		expiresIn: config.session.refresh.timeout,
		audience: config.session.domain,
		issuer: config.uuid
	});
	return {
		expiresIn,
		accessToken,
		refreshToken
	};
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
