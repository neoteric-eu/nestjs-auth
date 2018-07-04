import {AppLogger, AppDispatcher} from './app';

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
