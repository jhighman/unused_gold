// testJob.js

const processCSVJob = require('./src/jobs/Job');
const logger = require('./src/utils/logger'); // Ensure this path is correct

async function testJob() {
  try {
    logger.info('Starting test for processCSVJob.');

    await processCSVJob();

    logger.info('Test for processCSVJob completed successfully.');
  } catch (error) {
    logger.error('Test for processCSVJob failed:', error);
  }
}

testJob();
