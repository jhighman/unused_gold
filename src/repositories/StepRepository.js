// repositories/StepRepository.js

const mongoose = require('mongoose');
const logger = require('../utils/logger');

const stepSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  stepIdentifier: String,
  stepName: String,
  startTime: Date,
  finishTime: Date,
  status: String,
});

const Step = mongoose.model('Step', stepSchema);

class StepRepository {
  async createStep(jobId, stepName) {
    const step = new Step({
      job: jobId,
      stepIdentifier: stepName + '-' + Date.now(), // Unique step identifier
      stepName,
      startTime: new Date(),
      status: 'started'
    });
    await step.save();
    logger.info(`Step started: ${stepName}`);
    return step;
  }

  async updateStepFinishTime(stepIdentifier, status) {
    const finishTime = new Date();
    await Step.findOneAndUpdate({ stepIdentifier }, { finishTime, status });
    logger.info(`Step finished: ${stepIdentifier} with status: ${status}`);
  }
}

module.exports = StepRepository;
