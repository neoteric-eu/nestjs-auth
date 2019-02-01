import {Controller, Get} from '@nestjs/common';

@Controller()
export class HealthCheckController {
	private start: number;

	constructor() {
		this.start = Date.now();
	}

	@Get('healthcheck')
	async get() {
		const now = Date.now();
		return {
			status: 'API Online',
			uptime: Number((now - this.start) / 1000).toFixed(0)
		};
	}
}
