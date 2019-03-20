import {ApiModelProperty} from '@nestjs/swagger';
import {ExtendedEntity} from '../../_helpers';
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class SocialEntity extends ExtendedEntity {

	@ApiModelProperty()
	@PrimaryGeneratedColumn()
	public id: string;

	@ApiModelProperty()
	@Column()
	public userId: string;

	@ApiModelProperty()
	@Column()
	public cratedAt: string;

	@ApiModelProperty()
	@Column()
	public updatedAt: string;
}
