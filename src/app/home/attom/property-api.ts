import {HomeErrorEnum} from '../home-error.enum';

export class PropertyApi {
	public static STATUS_CODES = {
		'-5': {
			name: 'Invalid Parameter in Request',
			message: 'You passed an invalid search parameter'
		},
		'-4': {
			name: 'Invalid Parameter Combination',
			message: 'You passed an invalid combination of parameters'
		},
		'-3': {
			name: 'MissingAPIKey',
			message: 'You did not include the APIKey in your request'
		},
		'-2': {
			name: 'System Not Responding',
			message: 'There is a failure within the API'
		},
		'-1': {
			name: 'System Not Responding',
			message: 'There is a failure within the API'
		},
		'0': {
			name: 'SuccessWithResult',
			message: 'Your request was successful and returned results'
		},
		'1': {
			name: 'SuccessWithoutResult',
			message: 'Your request was successful but returned no results'
		},
		'10': {
			name: 'Invalid Date Format',
			message: 'You did not pass the date value as YYYY/MM/DD'
		},
		'11': {
			name: 'Invalid Date Range',
			message: 'Your date range contains an error such as conflicting start and end dates'
		},
		'12': {
			name: 'Sort Value Exceeded',
			message: 'You passed more than the allowed number of sort values. See Default Behavior.'
		},
		'13': {
			name: 'Invalid Sort Value',
			message: 'You passed a value that cannot be used for sort. See Sort Values.'
		},
		'14': {
			name: 'Invalid Search Distance',
			message: 'You passed a search distance beyond the maximum allowed. See Default Behavior.'
		},
		'15': {
			name: 'Invalid AVM Value Range',
			message: 'Your AVM Value range contains an error such as a higher minimum value than maximum value.'
		},
		'16': {
			name: 'Invalid Sale Amount Range',
			message: 'Your Sale Amount range contains an error such as a higher minimum value than maximum value.'
		},
		'17': {
			name: 'Invalid Tax Amount Range',
			message: 'Your Tax Amount range contains an error such as a higher minimum value than maximum value.'
		},
		'18': {
			name: 'Invalid Appr Impr Range',
			message: 'Your Appraised Improvement range contains an error such as a higher minimum value than maximum value.'
		},
		'19': {
			name: 'Invalid Appr Land Range',
			message: 'Your Appraised Land range contains an error such as a higher minimum value than maximum value.'
		},
		'20': {
			name: 'Invalid Appr Ttl Range',
			message: 'Your Appraised Total range contains an error such as a higher minimum value than maximum value.'
		},
		'21': {
			name: 'Invalid Assd Impr Range',
			message: 'Your Assessed Improvement range contains an error such as a higher minimum value than maximum value.'
		},
		'22': {
			name: 'Invalid Assd Land Range',
			message: 'Your Assessed Land range contains an error such as a higher minimum value than maximum value.'
		},
		'23': {
			name: 'Invalid Assd Ttl Range',
			message: 'Your Assessed Total range contains an error such as a higher minimum value than maximum value.'
		},
		'24': {
			name: 'Invalid Mkt Impr Range',
			message: 'Your Market Improvement range contains an error such as a higher minimum value than maximum value.'
		},
		'25': {
			name: 'Invalid Mkt Land Range',
			message: 'Your Market Land range contains an error such as a higher minimum value than maximum value.'
		},
		'26': {
			name: 'Invalid Mkt Ttl Range',
			message: 'Your Market Total range contains an error such as a higher minimum value than maximum value.'
		},
		'27': {
			name: 'Invalid Universal Size Range',
			message: 'Your Universal Size range contains an error such as a higher minimum value than maximum value.'
		},
		'28': {
			name: 'Invalid Year Built Range',
			message: 'Your Year Built range contains an error such as a start date later than your end date.'
		},
		'29': {
			name: 'Invalid Lot Size 1 Range',
			message: 'Your Lot Size 1 range contains an error such as a higher minimum value than maximum value.'
		},
		'30': {
			name: 'Invalid Lot Size 2 Range',
			message: 'Your Lot Size 2 range contains an error such as a higher minimum value than maximum value.'
		},
		'31': {
			name: 'Invalid Beds Range',
			message: 'Your Beds range contains an error such as a higher minimum value than maximum value.'
		},
		'32': {
			name: 'Invalid Baths Range',
			message: 'Your Baths range contains an error such as a higher minimum value than maximum value.'
		},
		'33': {
			name: 'GeoID Value Exceeded',
			message: 'You included more GeoIDs than are allowed in a single search. See Default Behavior.'
		},
		'34': {
			name: 'Invalid GeoID Value',
			message: 'You provided an invalid GeoID and should check that the data is correct.'
		},
		'100': {
			name: 'Unauthorized',
			message: 'You are not authorized to access the resource'
		},
		'201': {
			name: 'Geocoder Search No Result.',
			message: 'The geocoder could not find a match for the input address. Try again.',
			condition: HomeErrorEnum.GEOCODE_RESULTS_NOT_FOUND
		},
		'203': {
			name: 'Geocoder Search ZipCode Not Positioned.',
			message: 'The ZIP Code provided could not be properly positioned.',
			condition: HomeErrorEnum.GEOCODE_ZIP_CODE_POSITION
		},
		'204': {
			name: 'Geocoder Search ZipCode Required.',
			message: 'The address provided did not include a ZIP Code. Please add the ZIP Code and try again.',
			condition: HomeErrorEnum.GEOCODE_ZIP_CODE_REQUIRED
		},
		'205': {
			name: 'Geocoder Invalid Service.',
			message: 'Geocoder Invalid Service.',
			condition: HomeErrorEnum.GEOCODE_INVALID_SERVICE
		},
		'206': {
			name: 'Geocoder Service Temporarily Unavailable.',
			message: 'The geocoding service that accepts and translates addresses is currently unavailable. Radius searches cannot be performed.',
			condition: HomeErrorEnum.GEOCODE_SERVICE_TEMPORARY_UNAVAILABLE
		},
		'207': {
			name: 'Geocoder Unexpected Error.',
			message: 'An unexpected error occurred in the geocoding service. Try the search again.',
			condition: HomeErrorEnum.GEOCODE_UNEXPECTED_ERROR
		},
		'208': {
			name: 'Geocoder Value Format Error.',
			message: 'There was an error in the format of the request to the geocoding service. Check the input format and try again.\
				See Search Filters and review Address format.',
			condition: HomeErrorEnum.GEOCODE_FORMAT_ERROR
		},
		'210': {
			name: 'Geocoder Search Results Address Not Identified.',
			message: 'The input address could not be identified. Please try again.',
			condition: HomeErrorEnum.GEOCODE_ADDRESS_NOT_IDENTIFIED
		},
		'211': {
			name: 'Success with results. Address positioning is approximate to the ZIP Code.',
			message: 'The input address has been located with ZIP level precision, and a record is available.'
		},
		'212': {
			name: 'Success without results. No data available for this address.',
			message: 'The input address has been located with ZIP level precision, but a record is not available.'
		}
	}
	;
}
