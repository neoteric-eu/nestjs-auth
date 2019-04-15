import {ApiModelProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';
import {Column, Entity, ObjectIdColumn} from 'typeorm';
import {ExtendedEntity} from '../../_helpers';

@Entity()
export class UserConversationEntity extends ExtendedEntity {

	@ApiModelProperty()
	@ObjectIdColumn()
	public id: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public conversationId: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public userId: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public authorId: string;

	@Column()
	public isDeleted = false;
}
