import {ApiModelProperty} from '@nestjs/swagger';
import {BaseEntity, Column} from 'typeorm';

export class ExtendedEntity extends BaseEntity {
	public id?: string;

	@ApiModelProperty()
	@Column()
	public createdAt: string;

	@ApiModelProperty()
	@Column()
	public updatedAt: string;
}
