import admin from 'firebase-admin';
import {config} from '../../../config';
import {AppLogger} from '../../app.logger';
import MessagingPayload = admin.messaging.MessagingPayload;

const logger = new AppLogger(`FirebasePush`);

admin.initializeApp({
	credential: admin.credential.cert(config.firebase as any)
});

export async function push(token: string, message: MessagingPayload) {
	return admin.messaging().sendToDevice(token, message)
		.then((response) => {
			// Response is a message ID string.
			logger.log(`Successfully sent message: ${response}`);
		})
		.catch(error => {
			logger.error('Error sending message:', error);
		});
}
