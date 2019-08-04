import {Expose, Type} from 'class-transformer';
import {ScoreOutput} from '../../graphql.schema';

export class Condition {

	@Expose()
	avg_condition: number;

	@Expose()
	count: number;
}

export class ConditionScoreDto extends ScoreOutput {

	@Expose()
	@Type(() => Condition)
	public bathrooms: Condition;

	@Expose()
	@Type(() => Condition)
	public exterior: Condition;

	@Expose()
	@Type(() => Condition)
	public interior: Condition;

	@Expose()
	@Type(() => Condition)
	public kitchen: Condition;

	@Expose()
	@Type(() => Condition)
	public overall: Condition;
}
