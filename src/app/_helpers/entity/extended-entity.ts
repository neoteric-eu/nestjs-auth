import {ApiModelProperty} from '@nestjs/swagger';
import {BaseEntity, Column} from 'typeorm';
import {DateTime} from 'luxon';

export class ExtendedEntity extends BaseEntity {
	public id?: string;

	@Column()
	public isDeleted = false;

	@ApiModelProperty()
	@Column()
	public createdAt: DateTime;

	@ApiModelProperty()
	@Column()
	public updatedAt: DateTime;
}
