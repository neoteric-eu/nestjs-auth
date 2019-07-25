import {SMSTypeEnum} from './SMSType.enum';

export interface SmsOptionsInterface {
	sender: string;
	message: string;
	phoneNumber: string;
	smsType: SMSTypeEnum;
}
