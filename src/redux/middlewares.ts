import {Middleware} from '@reduxjs/toolkit';

const middlewares: Middleware[] = [];
// loggers
const LOGGER_ENABLED = false;

if (LOGGER_ENABLED ) {
  //middlewares.push(loggerMiddleware);
}

export default middlewares;
