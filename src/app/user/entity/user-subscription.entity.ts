import {ApiModelProperty} from '@nestjs/swagger';
import {IsBoolean, IsOptional} from 'class-validator';
import {ExtendedEntity} from '../../_helpers';
import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity()
export class UserSubscriptionEntity extends ExtendedEntity {

	@ApiModelProperty()
	@PrimaryColumn()
	public id: string; // user id

	@ApiModelProperty()
	@IsBoolean()
	@IsOptional()
	@Column()
	public email: boolean;

	@ApiModelProperty()
	@IsBoolean()
	@IsOptional()
	@Column()
	public push = false;
}
