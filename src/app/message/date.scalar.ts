import {Scalar} from '@nestjs/graphql';
import {Kind} from 'graphql';

@Scalar('Date')
export class DateScalar {
	description = 'Date custom scalar type';

	parseValue(value) {
		return new Date(value); // value from the client
	}

	serialize(value: Date) {
		return value.toISOString(); // value sent to the client
	}

	parseLiteral(ast) {
		if (ast.kind === Kind.STRING) {
			return new Date(ast.value); // ast value is always in string format
		}
		return null;
	}
}
