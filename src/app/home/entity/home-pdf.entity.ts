import {ApiModelProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';
import {ExtendedEntity} from '../../_helpers';
import {Column, Entity, ObjectIdColumn} from 'typeorm';

@Entity()
export class HomePdfEntity extends ExtendedEntity {

	@ApiModelProperty()
	@ObjectIdColumn()
	public id: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public homeId: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public sha1: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public bucket: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public key: string;

	public getUrl(): string {
		return `https://${this.bucket}.s3.amazonaws.com/${this.key}`;
	}
}
