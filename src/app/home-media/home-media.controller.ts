import {Controller} from '@nestjs/common';
import {Client, ClientProxy, MessagePattern, Transport} from '@nestjs/microservices';
import {AppLogger} from '../app.logger';
import {HomeEntity} from '../home/entity';
import {HOME_CMD_DELETE} from '../home/home.constants';
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
		await this.homeMediaService.updateAll({homeId: {eq: home.id.toString()}}, {isDeleted: true});
	}
}
