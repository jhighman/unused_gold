# unused_gold Application Workflow

## Overview
The `unused_gold` application processes CSV files containing records of licensed individuals. It reads, validates, maps, and stores these records in a database. The application is structured into several modules, each responsible for a specific part of the job.

## Application Start-up

### Server Initialization (`server.js`)
- Initializes the Express app.
- Starts the job scheduler.

### Job Scheduler (`JobScheduler.js`)
- Sets up a schedule for the CSV file processing job using a job scheduling library (e.g., Agenda).
- Defines a recurring task to process the CSV file at regular intervals.

## Job Execution

### Job Execution (`Job.js`)
- Executes when the scheduler triggers the job.
- Core script for CSV processing logic.

### Reading the CSV (`ItemReader.js`)
- `Job.js` calls `readCSV`, providing the path to the CSV file in the `data` directory.
- This function reads and parses the CSV file into records.

## Processing Each Record

### Validation, Mapping, and Database Insertion (`ProcessRecord.js`)
- Each CSV record is:
  - Validated through `validateRecord`.
  - Mapped to a model using `mapToModel`.
  - Saved in the database with `createRecord`.

## Logging and Error Handling
- The application uses a logging utility (`logger.js`) to log events and errors.
- Error handling is integrated throughout the process.


