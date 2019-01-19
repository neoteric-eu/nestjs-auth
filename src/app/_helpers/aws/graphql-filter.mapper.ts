import {
	beginsWith,
	between,
	contains,
	equals,
	greaterThan,
	greaterThanOrEqualTo,
	lessThan,
	lessThanOrEqualTo,
	notEquals
} from '@aws/dynamodb-expressions';

export interface GraphqlFilter {
	[key: string]: any;
}

export function graphqlFilterMapper(filters: GraphqlFilter[]) {
	return Object.keys(filters).map(filterName => {
		const filter = filters[filterName];
		return Object.keys(filter).map(key => {
			switch (key) {
				case 'eq':
					return {...equals(filter[key]), subject: filterName};
				case 'ne':
					return {...notEquals(filter[key]), subject: filterName};
				case 'le':
					return {...lessThanOrEqualTo(filter[key]), subject: filterName};
				case 'lt':
					return {...lessThan(filter[key]), subject: filterName};
				case 'ge':
					return {...greaterThanOrEqualTo(filter[key]), subject: filterName};
				case 'gt':
					return {...greaterThan(filter[key]), subject: filterName};
				case 'contains':
					return {...contains(filter[key]), subject: filterName};
				case 'notContains':
					return {
						type: 'Not',
						condition: {...contains(filter[key]), subject: filterName}
					};
				case 'between':
					return {...between(filter[key][0], filter[key][1]), subject: filterName};
				case 'beginsWith':
					return {...beginsWith(filter[key]), subject: filterName};
			}
		});
	}).flat();
}
