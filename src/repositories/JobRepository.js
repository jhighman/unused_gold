// repositories/JobRepository.js

const mongoose = require('mongoose');

// Define Job Schema
const jobSchema = new mongoose.Schema({
  identifier: String,
  name: String,
  startTime: Date,
  finishTime: Date,
  exitStatus: String,
  // Add additional fields to support commit points and restart capabilities
});

// Create a Mongoose model
const Job = mongoose.model('Job', jobSchema);

class JobRepository {
  async createJob(identifier, name) {
    const job = new Job({
      identifier,
      name,
      startTime: new Date(),
      exitStatus: 'started'
    });
    await job.save();
    return job;
  }

  async updateJobFinishTime(identifier, exitStatus) {
    const finishTime = new Date();
    await Job.findOneAndUpdate({ identifier }, { finishTime, exitStatus });
  }

  // Additional methods to handle commit points and restarts
  // ...

}

module.exports = JobRepository;
