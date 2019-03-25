import {ApiModelProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';
import {Column, Entity, ObjectIdColumn} from 'typeorm';
import {ExtendedEntity} from '../../_helpers';

@Entity()
export class HomeFavoriteEntity extends ExtendedEntity {

	@ApiModelProperty()
	@ObjectIdColumn()
	public id: string;


	@ApiModelProperty()
	@IsString()
	@Column()
	public homeFavoriteUserId: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public homeFavoriteHomeId: string;

	public fake = false;
}
