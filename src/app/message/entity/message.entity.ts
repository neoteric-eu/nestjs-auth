import {ApiModelProperty} from '@nestjs/swagger';
import {ExtendedEntity} from '../../_helpers';
import {IsBoolean, IsString} from 'class-validator';
import {Column, Entity, ObjectIdColumn} from 'typeorm';

@Entity()
export class MessageEntity extends ExtendedEntity {

	@ApiModelProperty()
	@ObjectIdColumn()
	public id: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public authorId: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public content: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public type: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public conversationId: string;

	@ApiModelProperty()
	@IsBoolean()
	@Column()
	public isSent = false;

	@ApiModelProperty()
	@IsBoolean()
	@Column()
	public isRead = false;

	@Column({
		array: true
	})
	public deletedFor: string[];
}
