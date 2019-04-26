import {Injectable} from '@nestjs/common';
import {AppLogger} from '../../app.logger';
import {HomeService} from '../../home/home.service';
import {RestVoterActionEnum, Voter} from '../../security';
import {UserEntity} from '../../user/entity';
import {ContractEntity} from '../entity';

@Injectable()
export class ContractVoter extends Voter {

	private logger = new AppLogger(ContractVoter.name);

	private readonly attributes = [
		RestVoterActionEnum.READ_ALL,
		RestVoterActionEnum.READ,
		RestVoterActionEnum.CREATE,
		RestVoterActionEnum.DELETE
	];

	constructor(
		private readonly homeService: HomeService
	) {
		super();
	}

	protected supports(attribute: any, subject: any): boolean {
		if (!this.attributes.includes(attribute)) {
			return false;
		}

		if (Array.isArray(subject)) {
			return subject.every(element => element instanceof ContractEntity);
		}

		return subject instanceof ContractEntity;
	}

	protected async voteOnAttribute(attribute: string, subject: ContractEntity | ContractEntity[], context): Promise<boolean> {
		const user = context.getUser();

		switch (attribute) {
			case RestVoterActionEnum.READ_ALL:
				return this.canReadAll(subject as ContractEntity[], user);
			case RestVoterActionEnum.READ:
				return this.canRead(subject as ContractEntity, user);
			case RestVoterActionEnum.CREATE:
				return this.canCreate(subject as ContractEntity, user);
			case RestVoterActionEnum.UPDATE:
				return this.canUpdate(subject as ContractEntity, user);
			case RestVoterActionEnum.DELETE:
				return this.canDelete(subject as ContractEntity, user);
		}

		return Promise.resolve(false);
	}

	private async canReadAll(contracts: ContractEntity[], user: UserEntity): Promise<boolean> {
		this.logger.debug('[canReadAll] everybody can read thier contracts');
		return true;
	}

	private async canRead(contract: ContractEntity, user: UserEntity): Promise<boolean> {
		this.logger.debug(`[canRead] any user can read contract ${contract.id}`);
		return true;
	}

	private canCreate(contract: ContractEntity, user: UserEntity) {
		this.logger.debug('[canCreate] everybody can create contracts');
		return true;
	}

	private async canUpdate(contract: ContractEntity, user: UserEntity) {
		this.logger.debug('[canUpdate] only owner of the contract can update his contract');
		return contract.userId === user.id.toString();
	}

	private async canDelete(contract: ContractEntity, user: UserEntity) {
		this.logger.debug('[canDelete] only owner of the contract or house can delete his contract');
		const userId = user.id.toString();
		const home = await this.homeService.findOneById(contract.home_id);
		return contract.userId === userId || home.owner === userId;
	}
}
