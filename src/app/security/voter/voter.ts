import {forwardRef, Inject, OnModuleInit} from '@nestjs/common';
import {VoterInterface} from './voter.interface';
import {AccessEnum} from './access.enum';
import {VoterRegistry} from './voter-registry';

export abstract class Voter implements VoterInterface, OnModuleInit {

	@Inject(forwardRef(() => VoterRegistry)) private readonly voterRegistry: VoterRegistry;

	public onModuleInit() {
		this.voterRegistry.register(this);
	}

	public async vote(token: any, subject: any, attributes: any[]): Promise<AccessEnum> {
		let vote = AccessEnum.ACCESS_ABSTAIN;

		for (const attribute of attributes) {
			if (!this.supports(attribute, subject)) {
				continue;
			}
			// as soon as at least one attribute is supported, default is to deny access
			vote = AccessEnum.ACCESS_DENIED;
			if (await this.voteOnAttribute(attribute, subject, token)) {
				// grant access as soon as at least one attribute returns a positive response
				return AccessEnum.ACCESS_GRANTED;
			}
		}

		return vote;
	}

	protected abstract supports(attribute, subject): boolean;

	protected async abstract voteOnAttribute(attribute, subject, token): Promise<boolean>;

}
