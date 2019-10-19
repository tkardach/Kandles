const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `logs_general.log` 
    // - Write all logs error (and below) to `logs_error.log`.
    //
    new winston.transports.File({ filename: 'logs_error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs_general.log' })
  ]
});

const securityLogger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: 'logs_security.log' })
  ]
});

const uncaughtExceptions = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: 'logs_uncaughtEx.log', level: 'error' })
  ]
});

// If we are not in production mode, add console logging
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
  uncaughtExceptions.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports.logger = logger;
module.exports.uncaughtExceptions = uncaughtExceptions;
module.exports.securityLogger = securityLogger;