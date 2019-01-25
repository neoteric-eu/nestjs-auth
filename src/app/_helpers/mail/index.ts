import {createTransport, SendMailOptions, SentMessageInfo} from 'nodemailer';
import {renderFile} from 'twig';
import fs from 'fs';
import {config} from '../../../config';

export async function mail(options: SendMailOptions): Promise<SentMessageInfo> {
	const transporter = createTransport({
		host: config.aws.pinpoint.smtp.host,
		port: config.aws.pinpoint.smtp.port,
		secure: true,
		auth: {
			user: config.aws.pinpoint.smtp.user,
			pass: config.aws.pinpoint.smtp.secret
		}
	});

	return transporter.sendMail({...options, from: config.mail.from});
}

export async function renderTemplate(path: string, data: any): Promise<string> {
	return new Promise((resolve, reject) => {
		fs.access(path, err => {
			if (err) {
				return reject(new Error(`File at path ${path} doesn't exists`));
			}
			renderFile(path, data, (inner_err, html) => {
				if (err) {
					return reject(err);
				}
				resolve(html);
			});
		});
	});
}
