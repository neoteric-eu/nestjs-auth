import {forwardRef, Module} from '@nestjs/common';
import {DatabaseModule} from '../database/database.module';
import {HomeModule} from '../home/home.module';
import {UserModule} from '../user/user.module';
import {contractProviders} from './contract.providers';
import {ContractResolver} from './contract.resolver';
import {ContractService} from './contract.service';
import {ContractVoter} from './security/contract.voter';

const PROVIDERS = [
	...contractProviders,
	ContractVoter,
	ContractResolver,
	ContractService
];

@Module({
	providers: [
		...PROVIDERS
	],
	imports: [
		DatabaseModule,
		forwardRef(() => HomeModule),
		UserModule
	],
	exports: [
		ContractService
	]
})
export class ContractModule {

}
