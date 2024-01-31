// src/jobs/steps/Step1.js

const { readCSV } = require('../../services/ItemReader');
const { validateRecord, mapToModel, createRecord } = require('../../services/ProcessRecord');
const logger = require('../../utils/logger');

async function processRecords(csvFilePath) {
    try {
        const records = await readCSV(csvFilePath);
        for (const record of records) {
            if (validateRecord(record)) {
                const model = mapToModel(record);
                await createRecord(model);
            }
        }
        logger.info('All records processed successfully.');
    } catch (error) {
        logger.error('Error processing records:', error);
        throw error;  // Re-throw the error to be handled by Job.js
    }
}

module.exports = processRecords;
