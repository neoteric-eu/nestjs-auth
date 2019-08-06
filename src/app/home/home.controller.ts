import {Body, Controller, HttpCode, Param, Post, UseGuards} from '@nestjs/common';
import {Client, ClientProxy, Transport} from '@nestjs/microservices';
import {ApiImplicitParam, ApiResponse, ApiUseTags, ApiBearerAuth} from '@nestjs/swagger';
import crypto from 'crypto';
import {AppLogger} from '../app.logger';
import {HomeService} from './home.service';
import {HomePipe} from './pipe/home.pipe';
import {HomeEntity} from './entity';
import {ConvertTemplateDto} from './dto/convert-template.dto';
import {HomePdfService} from './home-pdf.service';
import {AuthGuard} from '@nestjs/passport';

@ApiUseTags('home')
@Controller('home')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class HomeController {

	@Client({transport: Transport.TCP})
	private client: ClientProxy;

	private logger = new AppLogger(HomeController.name);

	constructor(
		private readonly homeService: HomeService,
		private readonly homePdfService: HomePdfService
	) {

	}

	@Post('import/addresses')
	@HttpCode(200)
	@ApiResponse({status: 204, description: 'NO CONTENT'})
	public async importAddresses(): Promise<void> {
		this.logger.silly(`[importAddresses] execute `);
		return this.homeService.importAddresses();
	}

	@Post('convert/:homeId')
	@ApiImplicitParam({name: 'homeId', description: 'Home identity', type: 'string', required: true})
	public async convertTemplate(
		@Param('homeId', HomePipe) home: HomeEntity,
		@Body() convert: ConvertTemplateDto
	) {
		const hash = JSON.stringify(Object.assign({}, {
			updatedAt: home.updatedAt,
			...convert
		}));
		const shasum = crypto.createHash('sha1');
		shasum.update(hash);
		const sha1 = shasum.digest('hex');
		let homePdf = await this.homePdfService.findOne({where: {homeId: home.id.toString(), sha1: sha1}});
		if (!homePdf) {
			const pdfParams = await this.homeService.callApi2pdf({home, media: convert});
			homePdf = await this.homePdfService.create({
				homeId: home.id.toString(),
				sha1: sha1,
				bucket: pdfParams.bucket,
				key: pdfParams.key
			});
		}
		return {
			url: homePdf.getUrl()
		};
	}
}
