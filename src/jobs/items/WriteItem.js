const BaseItem = require('./BaseItem');
const Operations = require('./Operations'); // Ensure the path is correct

class WriteItem extends BaseItem {
    constructor(jobId, stepName, context) {
        super(jobId, stepName, context, Operations.WRITE);
    }

    async write() {
        const model = this.context.get('mappedModel');
        if (!model) {
            throw new Error('No model to write');
        }

        logger.info('Creating record in the database:', model);
        try {
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    const isCreated = true; // Simulate success
                    if (isCreated) {
                        logger.info('Record created successfully:', model);
                        resolve(model);
                    } else {
                        logger.error('Record creation failed:', model);
                        reject(new Error('Failed to create record'));
                    }
                }, 1000);
            });

            this.context.set('recordCreated', true);
        } catch (error) {
            logger.error('Failed to create record in database:', error);
            this.context.set('recordCreated', false);
            throw error;
        }
    }
}
