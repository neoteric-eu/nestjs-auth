import {ApiModelProperty} from '@nestjs/swagger';
import {IsBoolean, IsOptional, IsString} from 'class-validator';
import {ExtendedEntity} from '../../_helpers';
import {Column, Entity, ObjectIdColumn} from 'typeorm';

@Entity()
export class UserSubscriptionEntity extends ExtendedEntity {

	@ApiModelProperty()
	@ObjectIdColumn()
	public id: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public user: string;

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

	@ApiModelProperty()
	@IsBoolean()
	@IsOptional()
	@Column()
	public sms = false;
}
