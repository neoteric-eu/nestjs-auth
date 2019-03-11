import {Controller} from '@nestjs/common';
import {Client, ClientProxy, MessagePattern, Transport} from '@nestjs/microservices';
import {AppLogger} from '../app.logger';
import {HOME_CMD_DELETE} from '../home/home.constants';
import {HomeEntity} from '../home/entity';
import {HomeMediaService} from './home-media.service';
import {MEDIA_CMD_DELETE} from '../media/media.constants';

@Controller('home-favorite')
export class HomeMediaController {

	@Client({ transport: Transport.TCP })
	private client: ClientProxy;

	private logger = new AppLogger(HomeMediaController.name);

	constructor(private readonly homeMediaService: HomeMediaService) {

	}

	@MessagePattern({ cmd: HOME_CMD_DELETE })
	public async onMediaDelete(home: HomeEntity): Promise<void> {
		this.logger.debug(`[onMediaDelete] delete all medias for home ${home.id}`);
		const deletedHomeMedias = await this.homeMediaService.deleteAll({filter: {homeFavoriteHomeId: {eq: home.id}}});

		for (const homeMedia of deletedHomeMedias) {
			this.client.send({cmd: MEDIA_CMD_DELETE}, homeMedia).subscribe();
		}
	}
}
