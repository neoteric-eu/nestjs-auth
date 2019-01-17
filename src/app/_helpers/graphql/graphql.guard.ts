import {ExecutionContext, Injectable} from '@nestjs/common';
import {GqlExecutionContext} from '@nestjs/graphql';
import {AuthGuard} from '@nestjs/passport';
import {ExecutionContextHost} from '@nestjs/core/helpers/execution-context.host';
import {Observable} from 'rxjs';

@Injectable()
export class GraphqlGuard extends AuthGuard('jwt') {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const ctx = GqlExecutionContext.create(context);
		const {req} = ctx.getContext();
		return super.canActivate(new ExecutionContextHost([req]));
	}
}
