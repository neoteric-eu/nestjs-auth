import {Global, Module} from '@nestjs/common';
import {VoterRegistry} from './voter';
import {AuthorizationChecker} from './authorization-checker';
import {SecurityService} from './security.service';

const PROVIDERS = [
	VoterRegistry,
	SecurityService,
	AuthorizationChecker
];

@Global()
@Module({
	providers: [...PROVIDERS],
	exports: [...PROVIDERS]
})
export class SecurityModule {
}
