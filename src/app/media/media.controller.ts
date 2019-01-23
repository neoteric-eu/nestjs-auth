import {Controller, FileInterceptor, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {ApiConsumes, ApiImplicitFile, ApiUseTags} from '@nestjs/swagger';

@ApiUseTags('media')
@Controller()
export class MediaController {

	@Post('upload')
	@UseInterceptors(FileInterceptor('media'))
	@ApiConsumes('multipart/form-data')
	@ApiImplicitFile({ name: 'media', required: true, description: 'Any media file' })
	uploadFile(@UploadedFile() file) {
		return file;
	}
}
