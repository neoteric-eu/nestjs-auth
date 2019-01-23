import S3 from 'aws-sdk/clients/s3';
import {Injectable, MulterModuleOptions, MulterOptionsFactory} from '@nestjs/common';
import {v4} from 'uuid';
import s3Storage from 'multer-s3';
import {config} from '../../config';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
	createMulterOptions(): MulterModuleOptions {
		const s3 = new S3();
		const bucket = config.aws.s3.bucket_name;
		return {
			storage: s3Storage({
				s3,
				bucket,
				key: (req, media, cb) => cb(null, v4())
			})
		};
	}
}
