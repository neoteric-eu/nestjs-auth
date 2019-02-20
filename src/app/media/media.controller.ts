import {Controller, FileInterceptor, Post, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {MessagePattern} from '@nestjs/microservices';
import {AuthGuard} from '@nestjs/passport';
import {ApiBearerAuth, ApiConsumes, ApiImplicitFile, ApiUseTags} from '@nestjs/swagger';
import S3 from 'aws-sdk/clients/s3';
import {config} from '../../config';
import {AppLogger} from '../app.logger';
import {HomeMediaEntity} from '../home-media/entity';
import {MEDIA_CMD_DELETE} from './media.constants';

@ApiUseTags('media')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('media')
export class MediaController {

	private logger = new AppLogger(MediaController.name);

	@Post('upload')
	@UseInterceptors(FileInterceptor('media'))
	@ApiConsumes('multipart/form-data')
	@ApiImplicitFile({ name: 'media', required: true, description: 'Any media file' })
	public uploadFile(@UploadedFile() file) {
		return file;
	}

	@MessagePattern({ cmd: MEDIA_CMD_DELETE })
	public async onMediaDelete(homeMedia: HomeMediaEntity): Promise<void> {
		const key = new URL(homeMedia.url).pathname.substring(1);
		this.logger.debug(`[onMediaDelete] Going to remove key ${key} from bucket ${config.aws.s3.bucket_name}`);
		const s3 = new S3();
		s3.deleteObject({
			Bucket: config.aws.s3.bucket_name,
			Key: key
		}).promise().then(() => {
			this.logger.debug(`[onMediaDelete] item with key: ${key} removed from bucket`);
		}).catch(() => {
			this.logger.warn(`[onMediaDelete] looks like this key ${key} doesn't exists on bucket`);
		});
	}
}
