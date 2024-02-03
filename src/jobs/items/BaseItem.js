// src/jobs/items/BaseItem.js

const logger = require('../../utils/logger');
const Operations = require('./Operations');

class BaseItem {
    constructor(jobId, stepName, context, operation) {
        if (!Object.values(Operations).includes(operation)) {
            throw new Error(`Invalid operation: ${operation}`);
        }

        this.jobId = jobId;
        this.stepName = stepName;
        this.context = context;
        this.operation = operation;
        this.nextItem = null;
        this.shouldContinue = true;
    }

    setNextItem(item) {
        this.nextItem = item;
    }

    controlFlow(continueExecution) {
        this.shouldContinue = continueExecution;
    }

    async start() {
        // Placeholder for starting logic, if any
        logger.info(`${this.stepName}: *************** Starting ${this.operation} operation...`);
    }

    async finish(status) {
        // Placeholder for finishing logic, if any
        logger.info(`${this.stepName}: ${this.operation} operation finished with status: ${status}.`);
    }

    async validate() {
        throw new Error('Validate operation is not implemented');
    }

    async enrich() {
        throw new Error('Enrich operation is not implemented');
    }

    async transform() {
        throw new Error('Transform operation is not implemented');
    }

    async write() {
        throw new Error('Write operation is not implemented');
    }

    async executeOperation() {
        switch (this.operation) {
            case Operations.VALIDATE:
                await this.validate();
                break;
            case Operations.ENRICH:
                await this.enrich();
                break;
            case Operations.TRANSFORM:
                await this.transform();
                break;
            case Operations.WRITE:
                await this.write();
                break;
            default:
                throw new Error(`Unknown operation: ${this.operation}`);
        }
    }
    
    async execute() {
        await this.start();
        try {
            await this.executeOperation();
            await this.finish('completed');
            if (this.shouldContinue && this.nextItem) {
                await this.nextItem.execute();
            }
        } catch (error) {
            await this.finish('failed');
            logger.error(`${this.stepName}: Error executing ${this.operation} operation:`, error);
            // Optionally control whether to continue to the next item on error
            if (this.nextItem && this.shouldContinue) {
                await this.nextItem.execute();
            }
        }
    }
}

module.exports = BaseItem;
