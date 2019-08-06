import {createTransport, SendMailOptions, SentMessageInfo} from 'nodemailer';
import {TwingEnvironment, TwingLoaderFilesystem} from 'twing';
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

export function renderTemplate(path: string, data: any): string {
	const loader = new TwingLoaderFilesystem(config.assetsPath);
	const twing = new TwingEnvironment(loader);
	return twing.render(path, data);
}
