const BaseStep = require('./BaseStep');
const { readCSV } = require('../../services/ItemReader');
const logger = require('../../utils/logger');
const ValidateRecordItem = require('../items/ValidateRecordItem');
const TransformItem = require('../items/TransformItem');
const WriteItem = require('../items/WriteItem');
const Context = require('../Context');
const Operations = require('../items/Operations'); // Ensure path is correct


class Step1 extends BaseStep {
    constructor(jobId, context) {
        super(jobId, 'Step1', context);
        this.csvFilePath = this.context.get('csvFilePath');
        logger.debug(`[Step1] Constructor: csvFilePath set to ${this.csvFilePath}`);
    }

    async executeStep() {
        logger.info(`[Step1] ExecuteStep: Starting with csvFilePath: ${this.csvFilePath}`);
        try {
            if (!this.csvFilePath) {
                throw new Error("csvFilePath is not provided in the context");
            }

            const records = await readCSV(this.csvFilePath);
            logger.debug(`[Step1] ________________ExecuteStep: Found ${records.length} records to process`);


            for (const [index, record] of records.entries()) {
                logger.info(`[Step1] Processing record ${index + 1}`);
                this.context.set('currentRecord', record);

                // Setup the chain of items with their specific operation
                const validateItem = new ValidateRecordItem(this.jobId, 'Operation 1', this.context);
                const transformItem = new TransformItem(this.jobId, 'Operation 2', this.context);
                const writeItem = new WriteItem(this.jobId, 'Operation 3', this.context);
                // Link the items in a chain
                validateItem.setNextItem(transformItem);
                transformItem.setNextItem(writeItem);

                logger.info(`[Step1] ExecuteStep: Executing item chain for record ${index + 1}`);
                // Start the execution chain from the first item
                await validateItem.execute();
                // The chain automatically continues based on each item's control flow decision

                // Log after successfully processing a record
                logger.info(`[Step1] Successfully processed record ${index + 1}`);
            }

            this.controlFlow(true); // Proceed with the next step
            logger.info(`[Step1] ExecuteStep: Successfully completed all records.`);
        } catch (error) {
            logger.error(`[Step1] ExecuteStep: Error processing records - ${error.message}`);
            this.controlFlow(false); // Halt the execution chain on error
            throw error;
        }
    }
}

module.exports = Step1;
