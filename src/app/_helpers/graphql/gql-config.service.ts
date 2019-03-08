import {join} from 'path';
import {Injectable} from '@nestjs/common';
import {GqlModuleOptions, GqlOptionsFactory} from '@nestjs/graphql';
import auth_hdr from 'passport-jwt/lib/auth_header';
import {config} from '../../../config';
import {verifyToken} from '../../auth/jwt';
import {TokenDto} from '../../auth/dto/token.dto';
import {UserService} from '../../user/user.service';
import {AppLogger} from '../../app.logger';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
	private logger = new AppLogger(GqlConfigService.name);

	constructor(private readonly userService: UserService) {

	}
	createGqlOptions(): GqlModuleOptions {
		return {
			typePaths: [join(process.cwd(), '**/*.graphql')],
			introspection: true,
			playground: true,
			installSubscriptionHandlers: true,
			tracing: !config.isProduction,
			debug: !config.isProduction,
			definitions: {
				path: join(process.cwd(), 'src/app/graphql.schema.ts'),
				outputAs: 'class'
			},
			subscriptions: {
				onConnect: (connectionParams, websocket, context) => {
					return new Promise(async (resolve, reject) => {
						try {
							const authToken = connectionParams['Authorization'];
							const token = await this.validateToken(authToken);
							const user = await this.userService.findOneById(token.id);
							resolve({req: {...context.request, user}});
						} catch (e) {
							this.logger.error(e.message, e.stack);
							reject({message: 'Unauthorized'});
						}
					});
				}
			},
			formatError: error => {
				delete error.extensions;
				return error;
			},
			context: (context) => {
				let req = context.req;
				if (context.connection) {
					req = context.connection.context.req;
				}
				return {req};
			}
		};
	}

	private async validateToken(authToken: string): Promise<TokenDto> {
		const jwtToken = auth_hdr.parse(authToken).value;
		this.logger.debug(`[validateToken] token ${jwtToken}`);
		return verifyToken(jwtToken, config.session.secret);
	}
}
