import {attribute, autoGeneratedHashKey, table} from '@aws/dynamodb-data-mapper-annotations';
import {ApiModelProperty} from '@nestjs/swagger';
import {IsBoolean, IsNumber, IsString} from 'class-validator';
import {ExtendedEntity} from '../../_helpers';

@table(`home`)
export class HomeEntity extends ExtendedEntity {

	@ApiModelProperty()
	@autoGeneratedHashKey()
	public id: string;

	@ApiModelProperty()
	@IsString()
	@attribute()
	public owner: string;

	@ApiModelProperty()
	@IsNumber()
	@attribute()
	public price: number;

	@ApiModelProperty()
	@IsNumber()
	@attribute()
	public price_adjustment: number;

	@ApiModelProperty()
	@IsString()
	@attribute()
	public descr: string;

	@ApiModelProperty()
	@IsString()
	@attribute()
	public json: string;

	@ApiModelProperty()
	@IsString()
	@attribute()
	public address_1: string;

	@ApiModelProperty()
	@IsString()
	@attribute()
	public address_2: string;

	@ApiModelProperty()
	@IsString()
	@attribute()
	public city: string;

	@ApiModelProperty()
	@IsString()
	@attribute()
	public state: string;

	@ApiModelProperty()
	@IsString()
	@attribute()
	public zip: string;

	@ApiModelProperty()
	@IsString()
	@attribute()
	public country: string;

	@ApiModelProperty()
	@IsNumber()
	@attribute()
	public beds: number;

	@ApiModelProperty()
	@IsNumber()
	@attribute()
	public baths: number;

	@ApiModelProperty()
	@IsNumber()
	@attribute()
	public lot_size: number;


	@ApiModelProperty()
	@IsNumber()
	@attribute()
	public sqft: number;


	@ApiModelProperty()
	@IsNumber()
	@attribute()
	public lat: number;


	@ApiModelProperty()
	@IsNumber()
	@attribute()
	public lng: number;


	@ApiModelProperty()
	@IsBoolean()
	@attribute()
	public pool: boolean;


	@ApiModelProperty()
	@IsNumber()
	@attribute()
	public fav_count: number;


	@ApiModelProperty()
	@IsNumber()
	@attribute()
	public showing_count: number;

	@ApiModelProperty()
	@IsBoolean()
	@attribute()
	public buyers_agent: boolean;


	@ApiModelProperty()
	@IsNumber()
	@attribute()
	public buyers_agent_amt: number;


	@ApiModelProperty()
	@IsNumber()
	@attribute()
	public buyers_agent_type: number;
}
