// src/jobs/steps/Step3.js

const fs = require('fs');
const path = require('path');
const { getBucket } = require('../../config/dbConnection');
const BaseStep = require('./BaseStep');

class Step3 extends BaseStep {
    constructor(jobId, csvFilePath) {
        super(jobId, 'Step3');
        this.csvFilePath = csvFilePath;
    }

    async executeStep() {
        try {
            const bucket = getBucket();
            if (!bucket) {
                throw new Error('GridFS bucket is not available');
            }

            // Create a read stream from the file
            const readStream = fs.createReadStream(this.csvFilePath);
            const filename = path.basename(this.csvFilePath);

            // Create a GridFS write stream
            const writeStream = bucket.openUploadStream(filename);

            readStream.pipe(writeStream);

            writeStream.on('finish', () => {
                console.log(`File ${filename} is written to GridFS`);
            });

            writeStream.on('error', (error) => {
                throw error;
            });

        } catch (error) {
            throw error;
        }
    }
}

module.exports = Step3;
