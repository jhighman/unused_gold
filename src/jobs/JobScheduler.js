// jobs/JobScheduler.js

const Agenda = require('agenda');
const processCSVJob = require('./Job');
const logger = require('../utils/logger'); // Assuming logger is in the utils directory

async function startJobScheduler() {
  try {
    const agenda = new Agenda({ 
      db: { 
        address: process.env.DB_URI,
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true
        } 
      } 
    });

    agenda.define('process csv', async job => {
      try {
        await processCSVJob();
        logger.info('CSV processing job executed successfully.');
      } catch (err) {
        logger.error('Error in CSV processing job:', err);
      }
    });

    await agenda.start();
    //await agenda.every('1 hour', 'process csv');
    await agenda.every('1 minute', 'process csv');
    logger.info('Job scheduler started successfully.');
  } catch (error) {
    logger.error('Job scheduler failed to start:', error);
    throw error; // Re-throw the error if you want to handle it further up the chain.
  }
}

module.exports = startJobScheduler;
