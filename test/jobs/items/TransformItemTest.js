
// src/test/items/TransformItem.js
const chai = require('chai');
const sinon = require('sinon');
const TransformItem = require('../../jobs/items/TransformItem');
const Operations = require('../../jobs/items/Operations');

const { expect } = chai;

describe('TransformItem', () => {
    it('should throw an error if no record to transform', async () => {
        const context = {
            get: sinon.stub().returns(undefined), // Simulate no record in context
        };
        const transformItem = new TransformItem('jobId', 'stepName', context);

        try {
            await transformItem.transform();
            // The line below should not be reached, and the test should fail
            expect.fail('Expected an error to be thrown');
        } catch (error) {
            expect(error.message).to.equal('No record to transform');
        }
    });

    it('should perform transformation when record is available', async () => {
        const context = {
            get: sinon.stub().returns({}), // Simulate a record in context
            set: sinon.stub(),
        };
        const transformItem = new TransformItem('jobId', 'stepName', context);

        await transformItem.transform();

        // Assert that the 'mappedModel' is set in the context
        expect(context.set.calledWith('mappedModel', sinon.match.any)).to.be.true;
    });
});
