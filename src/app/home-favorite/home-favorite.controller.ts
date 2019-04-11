import {Controller} from '@nestjs/common';
import {Client, ClientProxy, MessagePattern, Transport} from '@nestjs/microservices';
import {AppLogger} from '../app.logger';
import {HOME_CMD_DELETE} from '../home/home.constants';
import {HomeFavoriteService} from './home-favorite.service';
import {HomeEntity} from '../home/entity';

@Controller('home-favorite')
export class HomeFavoriteController {

	@Client({ transport: Transport.TCP })
	private client: ClientProxy;

	private logger = new AppLogger(HomeFavoriteController.name);

	constructor(private readonly homeFavoriteService: HomeFavoriteService) {

	}

	@MessagePattern({ cmd: HOME_CMD_DELETE })
	public async onHomeDelete(home: HomeEntity): Promise<void> {
		this.logger.debug(`[onHomeDelete] soft delete all favorites for home ${home.id}`);
		await this.homeFavoriteService.updateAll({homeFavoriteHomeId: {eq: home.id.toString()}}, {isDeleted: true});
	}
}
