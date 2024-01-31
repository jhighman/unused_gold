// utils/errorHandler.js

const logger = require('./logger');

const errorHandler = (err, req, res, next) => {
    // Log the error for debugging purposes
    logger.error(err.stack);

    // Set the response status code
    const statusCode = err.statusCode || 500; // Defaults to 500 if not set
    res.status(statusCode);

    // Send a response to the client
    res.json({
        error: {
            status: statusCode,
            message: statusCode === 500 ? 'Internal Server Error' : err.message,
        },
    });
};

module.exports = errorHandler;
