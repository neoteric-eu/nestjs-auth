require('dotenv-safe').load();
import {AppLogger} from './app/app.logger';
import {AppDispatcher} from './app/app.dispatcher';

const logger = new AppLogger('Index');

logger.log(`Start`);

const dispatcher = new AppDispatcher();
dispatcher.dispatch()
	.then(() => logger.log('Everything up'))
	.catch(e => logger.error(e.message, e.trace));

process.on('SIGINT', async () => {
	await dispatcher.shutdown();
	logger.log('Graceful shutdown the server');
	process.exit();
});
