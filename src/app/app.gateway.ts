import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets';
import { LoggerService } from '@nestjs/common';
import { v4 } from 'uuid';
import { AppLogger } from './app.logger';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() server;

	private logger: LoggerService;

	constructor() {
		this.logger  = new AppLogger(AppGateway.name);
	}


	@SubscribeMessage('message')
	handleMessage(sender, data) {
		this.logger.log(`New socket message: ${data}`);
	}

	@SubscribeMessage('crsf')
	generateCRSF(client, data) {
		this.logger.log(`New socket request for crsf`);
		return v4();
	}

	afterInit(server: any) {
		this.logger.log(`WebSocket listening!`);
	}

	handleConnection(client: any) {
		this.logger.log('handle Connection');
	}

	handleDisconnect(client: any) {
		this.logger.log('handle Disconnect');
	}
}
