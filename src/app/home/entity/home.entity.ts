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
	@IsOptional()
	@Column()
	public provision: string;

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
	public fav_count = 0;


	@ApiModelProperty()
	@IsNumber()
	@Column()
	public showing_count = 0;

	@ApiModelProperty()
	@IsBoolean()
	@Column()
	public buyers_agent: boolean;


	@ApiModelProperty()
	@IsNumber()
	@IsOptional()
	@Column()
	public buyers_agent_amt: number;


	@ApiModelProperty()
	@IsNumber()
	@IsOptional()
	@Column()
	public buyers_agent_type: number;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public nonrealty_items?: string;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public lot?: string;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public block?: string;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public addition?: string;

	@ApiModelProperty()
	@IsNumber()
	@IsOptional()
	@Column()
	public mortgage_amount?: number;

	@ApiModelProperty()
	@IsOptional()
	@Column()
	public mortgage_date?: Date;

	@ApiModelProperty()
	@IsNumber()
	@IsOptional()
	@Column()
	public electricity?: number;

	@ApiModelProperty()
	@IsNumber()
	@IsOptional()
	@Column()
	public gas?: number;

	@ApiModelProperty()
	@IsNumber()
	@IsOptional()
	@Column()
	public internet?: number;

	@ApiModelProperty()
	@IsNumber()
	@IsOptional()
	@Column()
	public cable_sattelite?: number;

	@ApiModelProperty()
	@IsNumber()
	@IsOptional()
	@Column()
	public homeowners_insurance?: number;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public agent?: string;

	@ApiModelProperty()
	@IsNumber()
	@IsOptional()
	@Column()
	public agent_fee?: number;

	@ApiModelProperty()
	@IsOptional()
	@Column()
	public survey_date?: Date;

	@ApiModelProperty()
	@IsNumber()
	@IsOptional()
	@Column()
	public hoa?: number;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public elementary_school?: string;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public middle_school?: string;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public high_school?: string;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public style?: string;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public type?: string;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public roof_type?: string;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public exterior_material?: string;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public foundation_type?: string;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public utilities?: string;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public parking?: string;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public patio?: string;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public yard?: string;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public sprinklers?: string;

	@ApiModelProperty()
	@IsNumber()
	@IsOptional()
	@Column()
	public lot_depth?: number;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public lot_width?: string;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public parcel_number?: string;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public tax_history?: string;
}
