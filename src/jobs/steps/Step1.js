// src/jobs/steps/Step1.js

const BaseStep = require('./BaseStep');
const { readCSV } = require('../../services/ItemReader');
const { validateRecord, mapToModel, createRecord } = require('../../services/ProcessRecord');

class Step1 extends BaseStep {
    constructor(jobId, csvFilePath) {
        super(jobId, 'Step1');
        this.csvFilePath = csvFilePath;
    }

    async executeStep() {
        // Read and process the CSV file
        const records = await readCSV(this.csvFilePath);
        for (const record of records) {
            if (validateRecord(record)) {
                const model = mapToModel(record);
                await createRecord(model);
            }
        }
    }
}

module.exports = Step1;
