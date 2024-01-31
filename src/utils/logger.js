// logger.js

const winston = require('winston');

// Logger configuration
const logConfiguration = {
    transports: [
        new winston.transports.Console({
            level: 'info'
        }),
        new winston.transports.File({
            level: 'error',
            // Create the log file in the logs directory
            filename: './logs/error.log'
        })
    ],
    format: winston.format.printf(info => `${new Date().toISOString()} - ${info.level}: ${info.message}`)
};

// Create the logger
const logger = winston.createLogger(logConfiguration);

module.exports = logger;
