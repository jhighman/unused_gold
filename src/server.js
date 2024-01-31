// server.js

const app = require('./app'); // Import the Express app from app.js
const logger = require('./utils/logger');
const startJobScheduler = require('./jobs/JobScheduler'); // Import the job scheduler


// Set the port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  logger.info(`Server is listening on port ${PORT}`);

  // Start the job scheduler
  startJobScheduler()
    .then(() => logger.info("Job Scheduler started successfully"))
    .catch(err => logger.error("Job Scheduler failed to start:", err));
});
