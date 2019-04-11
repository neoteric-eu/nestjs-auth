import {Controller} from '@nestjs/common';
import {Client, ClientProxy, MessagePattern, Transport} from '@nestjs/microservices';
import {AppLogger} from '../app.logger';
import {HomeEntity} from '../home/entity';
import {HOME_CMD_DELETE} from '../home/home.constants';
import {MEDIA_CMD_DELETE} from '../media/media.constants';
import {HomeMediaService} from './home-media.service';

@Controller('home-favorite')
export class HomeMediaController {

	@Client({ transport: Transport.TCP })
	private client: ClientProxy;

	private logger = new AppLogger(HomeMediaController.name);

	constructor(private readonly homeMediaService: HomeMediaService) {

	}

	@MessagePattern({ cmd: HOME_CMD_DELETE })
	public async onMediaDelete(home: HomeEntity): Promise<void> {
		this.logger.debug(`[onMediaDelete] soft delete all medias for home ${home.id}`);
		const homeMedias = await this.homeMediaService.findAll({where: {homeId: home.id.toString()}});
		await this.homeMediaService.updateAll({homeId: {eq: home.id.toString()}}, {'$set': {isDeleted: true}});
		for (const homeMedia of homeMedias) {
			this.client.send({cmd: MEDIA_CMD_DELETE}, homeMedia).subscribe(() => {}, error => {
				this.logger.error(error, '');
			});
		}
	}
}
