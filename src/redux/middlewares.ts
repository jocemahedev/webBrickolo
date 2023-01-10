import {Middleware} from '@reduxjs/toolkit';
import {createLogger} from 'redux-logger';

const middlewares: Middleware[] = [];
// loggers
const LOGGER_ENABLED = false;
const loggerMiddleware = createLogger();
if (LOGGER_ENABLED && __DEV__) {
  middlewares.push(loggerMiddleware);
}

export default middlewares;
