// src/jobs/Job.js

const path = require('path');
const logger = require('../utils/logger');
const JobRepository = require('../repositories/JobRepository');
const jobRepo = new JobRepository();
const Step1 = require('./steps/Step1');
const Step2 = require('./steps/Step2');
const Step3 = require('./steps/Step3');

async function processCSVJob() {
    let job;
    const csvFilePath = path.join(__dirname, '../../data/sample.csv');
    const uniqueJobIdentifier = 'processCSV-' + Date.now(); // Unique job identifier

    try {
        // Create a new job record
        job = await jobRepo.createJob(uniqueJobIdentifier, 'Process CSV');

        // Pass the unique job identifier to each step
        const step1 = new Step1(job._id, csvFilePath);
        await step1.execute();

        const step2 = new Step2(job._id);
        await step2.execute();

        const step3 = new Step3(job._id, csvFilePath);
        await step3.execute();

        // Update the job record upon successful completion
        await jobRepo.updateJobFinishTime(uniqueJobIdentifier, 'completed');
        logger.info('CSV job completed successfully.');
    } catch (error) {
        logger.error('CSV job failed:', error);

        // Update the job record with failure status
        if (job) {
            await jobRepo.updateJobFinishTime(uniqueJobIdentifier, 'failed');
        }

        // Additional error handling if required
    }
}

module.exports = processCSVJob;
