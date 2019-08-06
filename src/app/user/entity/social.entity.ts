import {ApiModelProperty} from '@nestjs/swagger';
import {ExtendedEntity} from '../../_helpers';
import {Column, Entity, ObjectIdColumn} from 'typeorm';

@Entity()
export class SocialEntity extends ExtendedEntity {

	@ApiModelProperty()
	@ObjectIdColumn()
	public id: string;

	@ApiModelProperty()
	@Column()
	public userId: string;
}
