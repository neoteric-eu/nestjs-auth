
export interface AccessDecisionManagerInterface {
	decide(token, attributes: any[], object: any): Promise<boolean>;
}
