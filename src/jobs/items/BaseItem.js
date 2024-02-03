// src/jobs/items/BaseItem.js
const logger = require('../../utils/logger');
const Operations = require('./Operations');
const ItemRepository = require('../../repositories/ItemRepository');

class BaseItem {
    constructor(step, context, operation) {
        if (!Object.values(Operations).includes(operation)) {
            throw new Error(`Invalid operation: ${operation}`);
        }

        if (!step) {
            throw new Error('Step object is required');
        }

        this.step = step; // Store the entire step object
        this.context = context;
        this.operation = operation;
        this.item = null; // Placeholder for the item created during start
        this.nextItem = null;
        this.shouldContinue = false;
        this.expectedKeys = [];
        this.itemRepository = new ItemRepository();
    }

    setNextItem(item) {
        this.nextItem = item;
    }

    controlFlow(continueExecution) {
        this.shouldContinue = continueExecution;
    }

    async start() {
        logger.info(`${this.step.stepName}: -----> Starting ${this.operation} operation...`);

        // Create an item in the database for this operation and store it in the instance
        this.item = await this.itemRepository.createItem(this.step, this.operation);
    }

    async finish(status) {
        if (!this.item) {
            throw new Error('Attempted to finish an operation without starting it');
        }

        logger.info(`${this.step.stepName}: ${this.operation} operation finished with status: ${status}`);

        // Update the stored item with the finish status and time
        await this.itemRepository.updateItem(this.item, status);
    }

    // Placeholder methods. These should be implemented in subclasses.
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

    expects(key) {
        this.expectedKeys.push(key);
    }

    async executeOperation() {
        for (const key of this.expectedKeys) {
            if (!this.context.has(key)) {
                throw new Error(`Expected context key '${key}' is missing.`);
            }
        }

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
            logger.error(`${this.step.stepName}: Error executing ${this.operation} operation:`, error);
            if (this.nextItem && this.shouldContinue) {
                await this.nextItem.execute();
            }
        }
    }
}

module.exports = BaseItem;
