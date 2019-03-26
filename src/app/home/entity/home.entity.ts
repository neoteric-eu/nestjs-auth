import {ApiModelProperty} from '@nestjs/swagger';
import {IsBoolean, IsNumber, IsOptional, IsString} from 'class-validator';
import {ExtendedEntity} from '../../_helpers';
import {Column, Entity, ObjectIdColumn} from 'typeorm';

@Entity()
export class HomeEntity extends ExtendedEntity {

	@ApiModelProperty()
	@ObjectIdColumn()
	public id: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public owner: string;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public status: string;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public schedule: string;

	@ApiModelProperty()
	@IsNumber()
	@Column()
	public price: number;

	@ApiModelProperty()
	@IsNumber()
	@Column()
	public price_adjustment: number;

	@ApiModelProperty()
	@IsString()
	@Column()
	public descr: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public json: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public address_1: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public address_2: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public city: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public state: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public zip: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public country: string;

	@ApiModelProperty()
	@IsNumber()
	@Column()
	public beds: number;

	@ApiModelProperty()
	@IsNumber()
	@Column()
	public baths: number;

	@ApiModelProperty()
	@IsNumber()
	@Column()
	public lot_size: number;


	@ApiModelProperty()
	@IsNumber()
	@Column()
	public sqft: number;


	@ApiModelProperty()
	@IsNumber()
	@Column()
	public lat: number;


	@ApiModelProperty()
	@IsNumber()
	@Column()
	public lng: number;


	@ApiModelProperty()
	@IsBoolean()
	@Column()
	public pool: boolean;


	@ApiModelProperty()
	@IsNumber()
	@Column()
	public fav_count: number;


	@ApiModelProperty()
	@IsNumber()
	@Column()
	public showing_count: number;

	@ApiModelProperty()
	@IsBoolean()
	@Column()
	public buyers_agent: boolean;


	@ApiModelProperty()
	@IsNumber()
	@Column()
	public buyers_agent_amt: number;


	@ApiModelProperty()
	@IsNumber()
	@Column()
	public buyers_agent_type: number;
}
