import {Injectable} from '@nestjs/common';
import {RestVoterActionEnum, Voter} from '../../security';
import {UserEntity} from '../../user/entity';
import {AppLogger} from '../../app.logger';
import {HomeFavoriteEntity} from '../entity';

@Injectable()
export class HomeFavoriteVoter extends Voter {

	private logger = new AppLogger(HomeFavoriteVoter.name);

	private readonly attributes = [
		RestVoterActionEnum.READ_ALL,
		RestVoterActionEnum.CREATE,
		RestVoterActionEnum.DELETE
	];

	constructor() {
		super();
	}

	protected supports(attribute: any, subject: any): boolean {
		if (!this.attributes.includes(attribute)) {
			return false;
		}

		if (Array.isArray(subject)) {
			return subject.every(element => element instanceof HomeFavoriteEntity);
		}

		return subject instanceof HomeFavoriteEntity;
	}

	protected async voteOnAttribute(attribute: string, subject: HomeFavoriteEntity | HomeFavoriteEntity[], context): Promise<boolean> {
		const user = context.getUser();

		if (!(user instanceof UserEntity)) {
			return false;
		}

		switch (attribute) {
			case RestVoterActionEnum.READ_ALL:
				return this.canReadAll(subject as HomeFavoriteEntity[], user);
			case RestVoterActionEnum.CREATE:
				return this.canCreate(subject as HomeFavoriteEntity, user);
			case RestVoterActionEnum.DELETE:
				return this.canDelete(subject as HomeFavoriteEntity, user);
		}

		return Promise.resolve(false);
	}

	private async canReadAll(homeFavorites: HomeFavoriteEntity[], user: UserEntity): Promise<boolean> {
		this.logger.debug('[canReadAll] everybody can read their home favorites');
		return true;
	}

	private async canCreate(homeFavorite: HomeFavoriteEntity, user: UserEntity): Promise<boolean> {
		this.logger.debug('[canReadAll] everybody can add home to their home favorites');
		return true;
	}

	private async canDelete(homeFavorite: HomeFavoriteEntity, user: UserEntity): Promise<boolean> {
		this.logger.debug('[canDelete] only owner of the house can delete their favorites');
		return homeFavorite.homeFavoriteUserId === user.id.toString();
	}
}
