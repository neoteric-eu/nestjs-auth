import {BeforeInsert, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {IsArray, IsEmail, IsString, MinLength, Validate} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';
import {ExtendedEntity, passwordHash} from '../../_helpers';
import {IsUserAlreadyExist} from '../user.validator';

@Entity()
export class UserEntity extends ExtendedEntity {

	@ApiModelProperty()
	@PrimaryGeneratedColumn()
	public id: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public name: string;

	@ApiModelProperty()
	@IsEmail()
	@Validate(IsUserAlreadyExist, {
		message: 'User already exists'
	})
	@Column()
	public email: string;

	@ApiModelProperty()
	@Column()
	@MinLength(7)
	public password: string;

	@ApiModelProperty()
	@IsArray()
	@Column({type: 'text', array: true})
	public roles: string[];

	@BeforeInsert()
	hashPassword() {
		this.password = passwordHash(this.password);
	}
}
