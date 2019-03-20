import {ApiModelProperty} from '@nestjs/swagger';
import {ExtendedEntity} from '../../_helpers';
import {IsString} from 'class-validator';
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class ConversationEntity extends ExtendedEntity {

	@ApiModelProperty()
	@PrimaryGeneratedColumn()
	public id: string;

	@ApiModelProperty()
	@Column()
	public createdAt: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public homeId: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public type: string;
}
