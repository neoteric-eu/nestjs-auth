import {AccessEnum} from './access.enum';

export interface VoterInterface {
	vote(token: any, subject: any, attributes: any[]): Promise<AccessEnum>;
}
