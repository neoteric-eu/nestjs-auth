export interface FacebookObject {
	value: string;
}

export type FacebookProvider = 'facebook';

export interface FacebookProfile {
	displayName: string;
	email: FacebookObject[];
	gender: string;
	id: string;
	name: {
		familyName: string;
		givenName: string;
		middleName: string;
	};
	photos: FacebookObject[];
	provider: FacebookProvider;
	_json: {
		email: string;
		first_name: string;
		id: string;
		last_name: string;
		middle_name: string;
		name: string;
	};
	_raw: string;
}
