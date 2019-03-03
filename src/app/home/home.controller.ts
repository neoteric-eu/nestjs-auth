import {Controller, HttpCode, Post, UseGuards} from '@nestjs/common';
import {Client, ClientProxy, Transport} from '@nestjs/microservices';
import {ApiResponse, ApiUseTags} from '@nestjs/swagger';
import {AuthGuard} from '@nestjs/passport';
import {AppLogger} from '../app.logger';
import {HomeService} from './home.service';

@ApiUseTags('home')
@Controller('home')
@UseGuards(AuthGuard('jwt'))
export class HomeController {

	@Client({ transport: Transport.TCP })
	private client: ClientProxy;

	private logger = new AppLogger(HomeController.name);

	constructor(private readonly homeService: HomeService) {

	}

	@Post('import/addresses')
	@HttpCode(200)
	@ApiResponse({ status: 204, description: 'NO CONTENT' })
	public async importAddresses(): Promise<void> {
		this.logger.silly(`[importAddresses] execute `);
		return this.homeService.importAddresses();
	}
}
