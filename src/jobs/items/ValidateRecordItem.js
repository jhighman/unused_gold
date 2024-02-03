const BaseItem = require('./BaseItem');
const Operations = require('./Operations'); // Make sure the path is correct

class ValidateRecordItem extends BaseItem {
    constructor(jobId, stepName, context) {
        // Pass the "validate" operation type to the BaseItem constructor
        super(jobId, stepName, context, Operations.VALIDATE);
        this.record = this.context.get('currentRecord'); // Assuming "currentRecord" is set in the context
    }

    async validate() {
        // Validation logic here
        // Remember to call this.controlFlow(true or false) based on validation result
    }

    // Implement the executeOperation method specifically for validation
    async executeOperation() {
        await this.validate();
    }
}

module.exports = ValidateRecordItem;
