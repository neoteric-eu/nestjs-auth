import {ForbiddenException, Injectable} from '@nestjs/common';
import {AuthorizationChecker} from './authorization-checker';

@Injectable()
export class SecurityService {
	constructor(private readonly authorizationChecker: AuthorizationChecker) {

	}

	public async denyAccessUnlessGranted(attributes, subject): Promise<boolean> {
		const isGranted = await this.authorizationChecker.isGranted(attributes, subject);
		if (!isGranted) {
			throw new ForbiddenException(`You don't have permission to access this resource`);
		}
		return isGranted;
	}
}
