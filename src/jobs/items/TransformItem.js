const BaseItem = require('./BaseItem');
const logger = require('../../utils/logger');
const Operations = require('./Operations');

class TransformItem extends BaseItem {
    constructor(step, context) {
        super(step, context, Operations.TRANSFORM); // Pass the step and context in the correct order
        this.record = context.get('currentRecord'); // Assuming "currentRecord" is set in the context
    }

    async transform() {
        const record = this.context.get('currentRecord');
        if (!record) {
            throw new Error('No record to transform');
        }

        logger.info('Mapping record to model:', record);
        const mappedModel = {
            // Mapping logic here
        };

        this.context.set('mappedModel', mappedModel);
        logger.info('Mapped model:', mappedModel);
    }
}

module.exports = TransformItem;
