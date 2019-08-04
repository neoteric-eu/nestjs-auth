import {ApiModelProperty} from '@nestjs/swagger';
import {IsEmail, IsOptional, IsString, IsUrl, MinLength, Validate, ValidateIf} from 'class-validator';
import {DateTime} from 'luxon';
import {ExtendedEntity, passwordHash} from '../../_helpers';
import {IsUserAlreadyExist} from '../user.validator';
import {config} from '../../../config';
import {Column, Entity, ObjectIdColumn} from 'typeorm';

@Entity()
export class UserEntity extends ExtendedEntity {

	@ApiModelProperty()
	@ObjectIdColumn()
	public id: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public first_name: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public last_name: string;

	@ApiModelProperty()
	@IsEmail()
	@IsOptional()
	@ValidateIf(o => !o.id)
	@Validate(IsUserAlreadyExist, {
		message: 'User already exists'
	})
	@Column()
	public email: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public phone_num: string;

	@ApiModelProperty()
	@IsOptional()
	@IsUrl()
	@Column()
	public profile_img: string;

	@ApiModelProperty()
	@MinLength(config.passwordMinLength)
	@IsOptional()
	@Column()
	public password: string;

	@ApiModelProperty()
	@Column()
	public is_verified = false;

	@ApiModelProperty()
	@IsOptional()
	@Column()
	public provider: string;

	@ApiModelProperty()
	@IsOptional()
	@Column()
	public socialId: string;

	@ApiModelProperty()
	@IsOptional()
	@Column()
	public phone_token: string;

	@Column()
	public activationCode: string;

	@Column()
	public onlineAt: DateTime;

	hashPassword() {
		this.password = passwordHash(this.password);
	}
}
