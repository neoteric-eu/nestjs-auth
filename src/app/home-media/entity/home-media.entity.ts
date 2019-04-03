import {ApiModelProperty} from '@nestjs/swagger';
import {IsNumber, IsString} from 'class-validator';
import {ExtendedEntity} from '../../_helpers/entity';
import {Column, Entity, ObjectIdColumn} from 'typeorm';

@Entity()
export class HomeMediaEntity extends ExtendedEntity {

	@ApiModelProperty()
	@ObjectIdColumn()
	id: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	homeId: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	originalname: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	mimetype: string;

	@ApiModelProperty()
	@IsNumber()
	@Column()
	size: number;

	@ApiModelProperty()
	@IsString()
	@Column()
	url: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	type: string;

	@ApiModelProperty()
	@IsNumber()
	@Column()
	order: number;

	@ApiModelProperty()
	@IsString()
	@Column()
	caption: string;
}
