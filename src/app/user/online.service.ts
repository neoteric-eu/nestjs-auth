import {Injectable} from '@nestjs/common';
import {DateTime} from 'luxon';
import {UserEntity} from './entity';
import {UserService} from './user.service';

@Injectable()
export class OnlineService {
	private online = new Map<string, UserEntity>();

	constructor(private readonly userService: UserService) {

	}

	public isOnline(user: UserEntity): boolean {
		return this.online.has(user.id.toString());
	}

	public isOffline({id}: UserEntity): boolean {
		return !this.online.has(id.toString());
	}

	public async addUser(user: UserEntity): Promise<OnlineService> {
		user.onlineAt = DateTime.utc();
		await this.userService.update(user);
		this.online.set(user.id.toString(), user);
		return this;
	}

	public async removeUser(user: UserEntity): Promise<OnlineService> {
		user.onlineAt = DateTime.utc();
		await this.userService.update(user);
		this.online.delete(user.id.toString());
		return this;
	}
}
