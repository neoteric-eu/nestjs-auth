import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';


@Module({
	controllers: [MessageController]
})
export class MessageModule {
}
