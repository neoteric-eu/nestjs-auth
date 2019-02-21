import {AuthorizationCheckerInterface} from './authorization-checker.interface';
import {AccessDecisionManager, AccessDecisionStrategyEnum} from '../access-decision';
import {Injectable} from '@nestjs/common';
import {VoterRegistry} from '../voter';
import {RequestContext} from '../../_helpers/request-context';

@Injectable()
export class AuthorizationChecker implements AuthorizationCheckerInterface {
	private readonly adm: AccessDecisionManager;
	private readonly tokenStorage;

	constructor(voterRegistry: VoterRegistry) {
		this.adm = new AccessDecisionManager(voterRegistry.getVoters(), AccessDecisionStrategyEnum.STRATEGY_AFFIRMATIVE, true);
		this.tokenStorage = function () {
			return {
				getUser: () => RequestContext.currentUser()
			};
		};
	}

	public async isGranted(attributes, subject = null) {
		const token = this.tokenStorage();

		if (!Array.isArray(attributes)) {
			attributes = [attributes];
		}

		return this.adm.decide(token, attributes, subject);
	}
}
