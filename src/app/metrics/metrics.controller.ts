import { Controller, Get, Res } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { register } from 'prom-client';

@ApiUseTags('metrics')
@Controller('metrics')
export class MetricsController {

	@Get('/')
	public metrics(@Res() res): void {
		res.set('Content-Type', register.contentType);
		register.setDefaultLabels({ serviceName: 'api-v1' });
		res.end(register.metrics());
	}
}
