import { createParamDecorator } from '@nestjs/common';

export const Profile = createParamDecorator((data, req) => {
	return req.user;
});
