import exitHook from 'async-exit-hook';
import {CommandModule, CommandService} from 'nestjs-command';
import {AppDispatcher, AppLogger} from './app';

const logger = new AppLogger('Cli');

logger.log(`Start`);

const dispatcher = new AppDispatcher();
dispatcher.getContext().then(app => {
	app.select(CommandModule).get(CommandService).exec();
}).catch(e => {
	logger.error(e.message, e.stack);
	process.exit(1);
});

exitHook(() => logger.log('Graceful shutdown the server'));
