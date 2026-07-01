const morgan = require('morgan');
const logger = require('../utils/logger');

// Create a Morgan stream that writes to Winston
const morganStream = {
  write: (message) => {
    // Morgan adds a newline at the end, trim it
    logger.http(message.trim());
  },
};

/**
 * Morgan HTTP request logger middleware
 * Uses 'combined' format in production, 'dev' in development
 */
const requestLogger = morgan(
  process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  { stream: morganStream }
);

module.exports = requestLogger;
