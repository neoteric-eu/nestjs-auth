import {Between, Equal, FindManyOptions, LessThan, LessThanOrEqual, Like, MoreThan, MoreThanOrEqual, Not} from 'typeorm';

export function typeormFilterMapper(options: FindManyOptions) {
	const filters = options.where;
	const where = {};
	Object.keys(filters).forEach(filterName => {
		const filter = filters[filterName];
		return Object.keys(filter).forEach(key => {
			where[filterName] = mapToTypeOrm(key, filter);
		});
	});

	return where;
}

function mapToTypeOrm(key, filter) {
	switch (key) {
		case 'eq':
			return {'$eq': filter[key]};
		case 'ne':
			return {'$ne': filter[key]};
		case 'le':
			return {'$lte': filter[key]};
		case 'lt':
			return {'$lt': filter[key]};
		case 'ge':
			return {'$gte': filter[key]};
		case 'gt':
			return {'$gt': filter[key]};
		case 'contains':
			return {'$regex': new RegExp(filter[key], 'gi')};
		case 'beginsWith':
			return {'$regex': new RegExp(`^${filter[key]}`, 'gi')};
		case 'notContains':
			return {'$not': new RegExp(filter[key])};
		case 'between':
			return {
				'$gte': filter[key][0],
				'$lte': filter[key][1]
			};
	}
}
