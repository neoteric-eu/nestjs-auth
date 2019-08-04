import SNS from 'aws-sdk/clients/sns';
import {SmsOptionsInterface} from './sms-options.interface';

export async function sms(options: SmsOptionsInterface) {
	return new Promise((resolve, reject) => {
		const sns = new SNS();
		sns.setSMSAttributes({
			attributes: {
				DefaultSenderID: options.sender,
				DefaultSMSType: options.smsType
			}
		});
		const response = sns.publish({
			Message: options.message,
			PhoneNumber: options.phoneNumber
		}, (err, data) => {
			if (err) {
				return reject(err);
			}
			resolve(data);
		});
	});
}
