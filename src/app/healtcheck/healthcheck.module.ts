import {Module} from '@nestjs/common';
import {HealthCheckController} from './healthcheck.controller';

@Module({
	components: [],
	controllers: [HealthCheckController],
	modules: []
})
export class HealthCheckModule {}
