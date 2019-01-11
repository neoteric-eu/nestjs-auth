import { Controller, Get } from '@nestjs/common';
import { Client, ClientProxy, MessagePattern, Transport } from '@nestjs/microservices';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { Observable } from 'rxjs/Rx';
import { reduce } from 'rxjs/operators';
import { from } from 'rxjs/internal/observable/from';

@ApiUseTags('message')
@ApiBearerAuth()
@Controller('message')
export class MessageController {

	@Client({ transport: Transport.NATS })
	private client: ClientProxy;

	@MessagePattern({ cmd: 'sum' })
	public sumPattern(data: number[]): Observable<number> {
		return from(data).pipe(reduce((acc, val) => acc + val));
	}

	@Get('/sum')
	public sumAction(): Observable<number> {
		const pattern = { cmd: 'sum' };
		const payload = [1, 2, 3];
		return this.client.send<number>(pattern, payload);
	}

	@Get('/slow')
	public slowAction(): Promise<boolean> {
		return new Promise(resolve => setTimeout(() => resolve(), 150));
	}
}
