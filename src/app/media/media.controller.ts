import {Controller, FileInterceptor, Post, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {ApiBearerAuth, ApiConsumes, ApiImplicitFile, ApiUseTags} from '@nestjs/swagger';
import {AuthGuard} from '@nestjs/passport';

@ApiUseTags('media')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('media')
export class MediaController {

	@Post('upload')
	@UseInterceptors(FileInterceptor('media'))
	@ApiConsumes('multipart/form-data')
	@ApiImplicitFile({ name: 'media', required: true, description: 'Any media file' })
	uploadFile(@UploadedFile() file) {
		return file;
	}
}
