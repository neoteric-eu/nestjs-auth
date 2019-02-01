import {Module} from '@nestjs/common';
import {HealthCheckController} from './healthcheck.controller';

@Module({
	controllers: [HealthCheckController]
})
export class HealthCheckModule {}
