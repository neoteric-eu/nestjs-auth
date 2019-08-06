import {ApiModelProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';
import {ExtendedEntity} from '../../_helpers';
import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity()
export class UserEmailEntity extends ExtendedEntity {

	@ApiModelProperty()
	@PrimaryColumn()
	public id: string; // user email

	@ApiModelProperty()
	@IsString()
	@Column()
	public user_id: string;
}
