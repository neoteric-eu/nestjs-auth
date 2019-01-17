import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data, [root, args, ctx, info]) => ctx.req.user);
