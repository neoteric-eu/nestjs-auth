import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {ApiModelProperty} from '@nestjs/swagger';
import {ExtendedEntity} from '../../_helpers';
import {IsNotEmpty} from 'class-validator';

@Entity()
export class AccessControlEntity extends ExtendedEntity {

	@ApiModelProperty()
	@PrimaryGeneratedColumn()
	public id: string;

	@ApiModelProperty()
	@Column()
	@IsNotEmpty()
	public role: string;

	@ApiModelProperty()
	@Column()
	@IsNotEmpty()
	public resource: string;

	@ApiModelProperty()
	@Column()
	@IsNotEmpty()
	public action: string;

	@ApiModelProperty()
	@Column({type: 'text', array: true})
	@IsNotEmpty({
		each: true
	})
	public attributes: string[];
}
