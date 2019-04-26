import {ApiModelProperty} from '@nestjs/swagger';
import {IsBoolean, IsNumber, IsOptional, IsString} from 'class-validator';
import {Column, Entity, ObjectIdColumn} from 'typeorm';
import {ExtendedEntity} from '../../_helpers/entity';

@Entity()
export class ContractEntity extends ExtendedEntity {

	@ApiModelProperty()
	@ObjectIdColumn()
	public id: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public userId: string;

	@ApiModelProperty()
	@IsString()
	@Column()
	public home_id: string;

	@ApiModelProperty()
	@IsNumber()
	@IsOptional()
	@Column()
	public sales_price: number;

	@ApiModelProperty()
	@IsNumber()
	@IsOptional()
	@Column()
	public buyer_cash: number;

	@ApiModelProperty()
	@IsNumber()
	@IsOptional()
	@Column()
	public loan_amount: number;

	@ApiModelProperty()
	@IsNumber()
	@IsOptional()
	@Column()
	public earnest_money: number;

	@ApiModelProperty()
	@IsNumber()
	@IsOptional()
	@Column()
	public earnest_money_days: number;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public earnest_money_to: string;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public property_condition: string;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public repairs: string;

	@ApiModelProperty()
	@IsBoolean()
	@IsOptional()
	@Column()
	public home_warranty: boolean;

	@ApiModelProperty()
	@IsNumber()
	@IsOptional()
	@Column()
	public home_warranty_amount: number;

	@ApiModelProperty()
	@IsOptional()
	@Column()
	public closing_date: Date;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public special_provisions: string;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public non_realty_items: string;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public seller_expenses: string;

	@ApiModelProperty()
	@IsNumber()
	@IsOptional()
	@Column()
	public option_period_fee: number;

	@ApiModelProperty()
	@IsNumber()
	@IsOptional()
	@Column()
	public option_period_days: number;

	@ApiModelProperty()
	@IsBoolean()
	@IsOptional()
	@Column()
	public option_period_credit: boolean;

	@ApiModelProperty()
	@IsOptional()
	@Column()
	public contract_execution_date: Date;

	@ApiModelProperty()
	@IsOptional()
	@Column({
		array: true
	})
	public digital_signatures: string[];

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public title_policy_expense: string;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public title_policy_issuer: string;

	@ApiModelProperty()
	@IsNumber()
	@IsOptional()
	@Column()
	public title_policy_discrepancies_amendments_payment: number;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public survey: string;

	@ApiModelProperty()
	@IsNumber()
	@IsOptional()
	@Column()
	public new_survey_days: number;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public new_survey_payment: string;

	@ApiModelProperty()
	@IsString()
	@IsOptional()
	@Column()
	public amendments: string;


}
