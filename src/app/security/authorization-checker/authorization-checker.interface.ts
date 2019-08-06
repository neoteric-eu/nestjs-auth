export interface AuthorizationCheckerInterface {
	isGranted(attributes: any[], subject?: any): Promise<boolean>;
}
