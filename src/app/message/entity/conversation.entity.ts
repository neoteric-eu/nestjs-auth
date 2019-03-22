import {ApiModelProperty} from '@nestjs/swagger';
import {ExtendedEntity} from '../../_helpers';
import {IsString} from 'class-validator';
import {Column, Entity, ObjectIdColumn} from 'typeorm';

@Entity()
export class ConversationEntity extends ExtendedEntity {

	@ApiModelProperty()
	@ObjectIdColumn()
	public id: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public homeId: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public type: string;
}
