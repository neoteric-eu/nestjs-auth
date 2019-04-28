import {Injectable, OnModuleInit} from '@nestjs/common';
import {UserEntity} from '../user/entity';
import {MessageEntity} from './entity';

@Injectable()
export class MessageBuffer {
	private messages = new Map<string, Set<MessageEntity>>();

	constructor() {

	}

	public addMessage(userId: string, message: MessageEntity) {
		if (!this.messages.has(userId)) {
			this.messages.set(userId, new Set<MessageEntity>());
		}
		this.messages.get(userId).add(message);
	}

	public getEntries(): IterableIterator<[string, Set<MessageEntity>]> {
		return this.messages.entries();
	}

	public flush(userId) {
		this.messages.get(userId).clear();
	}

	public flushAll() {
		for (const [id, set] of this.messages.entries()) {
			set.clear();
		}
		this.messages.clear();
	}
}
