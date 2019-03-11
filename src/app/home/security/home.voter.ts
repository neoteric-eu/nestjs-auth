import {Injectable} from '@nestjs/common';
import {RestVoterActionEnum, Voter} from '../../security';
import {UserEntity} from '../../user/entity';
import {AppLogger} from '../../app.logger';
import {HomeService} from '../home.service';
import {HomeEntity} from '../entity';

@Injectable()
export class HomeVoter extends Voter {

	private logger = new AppLogger(HomeVoter.name);

	private readonly attributes = [
		RestVoterActionEnum.READ_ALL,
		RestVoterActionEnum.READ,
		RestVoterActionEnum.CREATE,
		RestVoterActionEnum.DELETE
	];

	constructor(private readonly homeService: HomeService) {
		super();
	}

	protected supports(attribute: any, subject: any): boolean {
		if (!this.attributes.includes(attribute)) {
			return false;
		}

		if (Array.isArray(subject)) {
			return subject.every(element => element instanceof HomeEntity);
		}

		return subject instanceof HomeEntity;
	}

	protected async voteOnAttribute(attribute: string, subject: HomeEntity | HomeEntity[], context): Promise<boolean> {
		const user = context.getUser();

		switch (attribute) {
			case RestVoterActionEnum.READ_ALL:
				return this.canReadAll(subject as HomeEntity[], user);
			case RestVoterActionEnum.READ:
				return this.canRead(subject as HomeEntity, user);
			case RestVoterActionEnum.CREATE:
				return this.canCreate(subject as HomeEntity, user);
			case RestVoterActionEnum.UPDATE:
				return this.canUpdate(subject as HomeEntity, user);
			case RestVoterActionEnum.DELETE:
				return this.canDelete(subject as HomeEntity, user);
		}

		return Promise.resolve(false);
	}

	private async canReadAll(homes: HomeEntity[], user: UserEntity): Promise<boolean> {
		this.logger.debug('[canReadAll] everybody can read homes');
		return true;
	}

	private async canRead(home: HomeEntity, user: UserEntity): Promise<boolean> {
		this.logger.debug(`[canRead] any user can read home ${home.id}`);
		return true;
	}

	private canCreate(home: HomeEntity, user: UserEntity) {
		this.logger.debug('[canCreate] everybody can create homes');
		return true;
	}

	private canUpdate(home: HomeEntity, user: UserEntity) {
		this.logger.debug('[canUpdate] only owner of the house can update his home');
		return home.owner === user.id;
	}

	private canDelete(home: HomeEntity, user: UserEntity) {
		this.logger.debug('[canDelete] only owner of the house can delete his home');
		return home.owner === user.id;
	}
}
