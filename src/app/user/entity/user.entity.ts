import {BeforeInsert, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {MinLength} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';
import {ExtendedEntity, passwordHash} from '../../_helpers';

@Entity()
export class UserEntity extends ExtendedEntity {

	@ApiModelProperty()
	@PrimaryGeneratedColumn()
	public id: string;

	@ApiModelProperty()
	@Column()
	public name: string;

	@ApiModelProperty()
	@Column()
	public email: string;

	@ApiModelProperty()
	@Column()
	@MinLength(7)
	public password: string;

	@ApiModelProperty()
	@Column({type: 'text', array: true})
	public roles: string[];

	@BeforeInsert()
	hashPassword() {
		this.password = passwordHash(this.password);
	}
}
