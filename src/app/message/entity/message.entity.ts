import {ApiModelProperty} from '@nestjs/swagger';
import {ExtendedEntity} from '../../_helpers';
import {IsBoolean, IsString} from 'class-validator';
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class MessageEntity extends ExtendedEntity {

	@ApiModelProperty()
	@PrimaryGeneratedColumn()
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
	public isSent: boolean;

	@ApiModelProperty()
	@IsBoolean()
	@Column()
	public isRead: boolean;
}
