import {Module, MulterModule} from '@nestjs/common';
import {MulterConfigService} from './multer-config.service';
import {DatabaseModule} from '../database/database.module';
import {MediaController} from './media.controller';

@Module({
	controllers: [MediaController],
	imports: [
		DatabaseModule,
		MulterModule.registerAsync({
			useClass: MulterConfigService
		})
	]
})
export class MediaModule {

}
