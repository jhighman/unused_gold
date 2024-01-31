// src/jobs/Job.js

const path = require('path');
const processRecords = require('./steps/Step1');
const archiveFile = require('./steps/Step2');
const logger = require('../utils/logger');

async function processCSVJob() {
    const csvFilePath = path.join(__dirname, '../../data/sample.csv');

    try {
        await processRecords(csvFilePath);
        await archiveFile(csvFilePath);
        logger.info('CSV job completed successfully.');
    } catch (error) {
        logger.error('CSV job failed:', error);
        // Additional error handling if required
    }
}

module.exports = processCSVJob;
