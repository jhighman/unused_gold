// test/jobs/jobTest.js

const { connectDB } = require('../../src/config/dbConnection');
const processCSVJob = require('../../src/jobs/Job');
const logger = require('../../src/utils/logger');
const mongoose = require('mongoose');
require('dotenv').config();

const testJob = async () => {
    try {
        // Await the establishment of the database connection
        await connectDB();
        logger.info('Database connected, starting job test.');

        // Run the job
        await processCSVJob();
        logger.info('Test completed successfully');
    } catch (error) {
        logger.error('Test failed:', error);
    } finally {
        // Ensure that the database connection is closed
        mongoose.connection.close();
        logger.info('Database connection closed.');
    }
};

testJob();
