const path = require('path');
const logger = require('../utils/logger');
const JobRepository = require('../repositories/JobRepository');
const jobRepo = new JobRepository();
const Context = require('./Context'); // Adjust the import path as necessary
const Step1 = require('./steps/Step1');
const Step2 = require('./steps/Step2');
const Step3 = require('./steps/Step3');

async function processCSVJob() {
    let job;
    const csvFilePath = path.join(__dirname, '../../data/sample.csv');
    const uniqueJobIdentifier = 'processCSV-' + Date.now(); // Unique job identifier
    logger.debug(`Starting CSV job with ID: ${uniqueJobIdentifier} using file: ${csvFilePath}`);

    try {
        // Create a new job record
        job = await jobRepo.createJob(uniqueJobIdentifier, 'Process CSV');
        logger.debug(`Job record created with ID: ${uniqueJobIdentifier}`);

        // Initialize the context and set shared data
        const context = new Context();
        context.set('csvFilePath', csvFilePath);
        context.set('jobId', job._id); // Assuming job._id is available
        //logger.debug(`Context initialized with CSV file path and job ID`);

        // Initialize and chain steps
        const step1 = new Step1(job._id, context); // Assuming job._id is the correct identifier to use
        const step2 = new Step2(job._id, context);
        const step3 = new Step3(job._id, context);

        logger.debug(`Steps initialized and chained: Step1 -> Step2 -> Step3`);

        //step1.setNextStep(step2);
        //step2.setNextStep(step3); // Chain as needed

        // Start the execution chain with Step1
        //logger.info(`Executing Step1`);
        await step1.execute();

        // Update the job record upon successful completion
        await jobRepo.updateJobFinishTime(uniqueJobIdentifier, 'completed');
        logger.info('Job completed successfully.');
    } catch (error) {
        logger.error('Job failed:', error);

        // Update the job record with failure status
        if (job) {
            await jobRepo.updateJobFinishTime(uniqueJobIdentifier, 'failed');
            logger.debug(`Job record updated with failure status for ID: ${uniqueJobIdentifier}`);
        }
    }
}

module.exports = processCSVJob;
