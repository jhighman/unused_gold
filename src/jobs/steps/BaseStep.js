// src/jobs/steps/BaseStep.js

const StepRepository = require('../../repositories/StepRepository');
const logger = require('../../utils/logger');

class BaseStep {
  constructor(jobId, stepName) {
    this.stepRepo = new StepRepository();
    this.jobId = jobId;
    this.stepName = stepName;
  }

  async start() {
    this.step = await this.stepRepo.createStep(this.jobId, this.stepName);
    logger.info(`${this.stepName} started.`);
  }

  async finish(status) {
    await this.stepRepo.updateStepFinishTime(this.step.stepIdentifier, status);
    logger.info(`${this.stepName} finished with status: ${status}.`);
  }

  async executeStep() {
    throw new Error('executeStep() must be implemented by subclasses');
  }

  async execute() {
    try {
      await this.start();
      await this.executeStep();
      await this.finish('completed');
    } catch (error) {
      logger.error(`Error in ${this.stepName}:`, error);
      await this.finish('failed');
      throw error; // Re-throw for higher-level handling
    }
  }
}

module.exports = BaseStep;
