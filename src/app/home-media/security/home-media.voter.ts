import {Injectable} from '@nestjs/common';
import {RestVoterActionEnum, Voter} from '../../security';
import {UserEntity} from '../../user/entity';
import {AppLogger} from '../../app.logger';
import {HomeMediaService} from '../home-media.service';
import {HomeMediaEntity} from '../entity';
import {HomeService} from '../../home/home.service';

@Injectable()
export class HomeMediaVoter extends Voter {

	private logger = new AppLogger(HomeMediaVoter.name);

	private readonly attributes = [
		RestVoterActionEnum.READ_ALL,
		RestVoterActionEnum.CREATE,
		RestVoterActionEnum.DELETE
	];

	constructor(
		private readonly homeMediaService: HomeMediaService,
		private readonly homeService: HomeService
	) {
		super();
	}

	protected supports(attribute: any, subject: any): boolean {
		if (!this.attributes.includes(attribute)) {
			return false;
		}

		if (Array.isArray(subject)) {
			return subject.every(element => element instanceof HomeMediaEntity);
		}

		return subject instanceof HomeMediaEntity;
	}

	protected async voteOnAttribute(attribute: string, subject: HomeMediaEntity | HomeMediaEntity[], context): Promise<boolean> {
		const user = context.getUser();

		if (!(user instanceof UserEntity) && attribute !== RestVoterActionEnum.READ_ALL) {
			return false;
		}

		switch (attribute) {
			case RestVoterActionEnum.READ_ALL:
				return this.canReadAll(subject as HomeMediaEntity[], user);
			case RestVoterActionEnum.CREATE:
				return this.canCreate(subject as HomeMediaEntity, user);
			case RestVoterActionEnum.DELETE:
				return this.canDelete(subject as HomeMediaEntity, user);
		}

		return Promise.resolve(false);
	}

	private async canReadAll(homeMedias: HomeMediaEntity[], user: UserEntity): Promise<boolean> {
		this.logger.debug('[canReadAll] everybody can read home medias');
		return true;
	}

	private async canCreate(homeMedia: HomeMediaEntity, user: UserEntity): Promise<boolean> {
		this.logger.debug('[canCreate] only owner of the house can create home media');
		const home = await this.homeService.findOneById(homeMedia.homeId);
		return home.owner === user.id;
	}

	private async canDelete(homeMedia: HomeMediaEntity, user: UserEntity): Promise<boolean> {
		this.logger.debug('[canDelete] only owner of the house can delete home media');
		const home = await this.homeService.findOneById(homeMedia.homeId);
		return home.owner === user.id;
	}
}
