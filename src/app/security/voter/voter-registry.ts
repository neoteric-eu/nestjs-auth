import {Voter} from './voter';
import {Injectable} from '@nestjs/common';

@Injectable()
export class VoterRegistry {
	private voters = new Set<Voter>();

	public register(voter: Voter) {
		this.voters.add(voter);
	}

	public getVoters(): IterableIterator<Voter> {
		return this.voters.values();
	}
}
