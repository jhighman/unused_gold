// src/jobs/steps/BaseStep.js

const StepRepository = require('../../repositories/StepRepository');
const logger = require('../../utils/logger');

class BaseStep {
  constructor(jobId, stepName, context) {
    this.stepRepo = new StepRepository();
    this.jobId = jobId;
    this.stepName = stepName;
    this.context = context; // Context object for shared data between steps
    this.shouldContinue = true; // Flag to control flow
    this.nextStep = null; // Reference to the next step in the chain
  }

  setNextStep(step) {
    this.nextStep = step;
  }

  async start() {
    this.step = await this.stepRepo.createStep(this.jobId, this.stepName);
    logger.info(`${this.stepName} started.`);
  }

  async finish(status) {
    await this.stepRepo.updateStepFinishTime(this.step.stepIdentifier, status);
    logger.info(`${this.stepName} finished with status: ${status}.`);
  }

  // Method to control the flow based on the step's outcome
  controlFlow(continueExecution) {
    this.shouldContinue = continueExecution;
  }

  async executeStep() {
    // To be overridden by subclasses with specific step logic
    throw new Error('executeStep() must be implemented by subclasses');
  }

  async execute() {
    try {
      await this.start();
      await this.executeStep();
      if (this.shouldContinue && this.nextStep) {
        await this.nextStep.execute();
      } else {
        await this.finish('completed');
      }
    } catch (error) {
      logger.error(`Base execure Error in ${this.stepName}:`, error);
      await this.finish('failed');
      throw error; // Optionally re-throw for higher-level handling
    }
  }
}

module.exports = BaseStep;
