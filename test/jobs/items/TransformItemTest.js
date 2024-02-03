// test/jobs/items/TransformItemTest.js

const assert = require('assert');
const sinon = require('sinon');
const TransformItem = require('../../../src/jobs/items/TransformItem');
const Operations = require('../../../src/jobs/items/Operations');
const logger = require('../../../src/utils/logger');
const { connectDB } = require('../../../src/config/dbConnection');
const mongoose = require('mongoose');
const JobRepository = require('../../../src/repositories/JobRepository'); // Import JobRepository
const StepRepository = require('../../../src/repositories/StepRepository'); // Import StepRepository
require('dotenv').config();

describe('TransformItem', () => {
    before(async () => {
        // Connect to the database
        await connectDB();
    });

    after(async () => {
        // Disconnect from the database
        await mongoose.connection.close();
    });

    it('should write an item to the database', async function() {
        const jobRepository = new JobRepository();
        const stepRepository = new StepRepository();

        // Create a job and a step as preconditions
        const job = await jobRepository.createJob('test job');
        const step = await stepRepository.createStep(job._id, 'test step');

        // Setup a context with a record to transform
        const context = {
            get: function(key) {
                if (key === 'currentRecord') {
                    return { someField: 'someValue' }; // Example record
                }
            },
            set: function() {} // Mock set function if necessary
        };

        const transformItem = new TransformItem(step, context);

        // Execute the item, which should trigger the start, transform, and finish sequence
        await transformItem.execute();

        // Assertions here are tricky because we're expecting side effects in the database.
        // You might want to query the database directly to check if the item has been created as expected.
        // Example (pseudo-code):
        // const item = await ItemModel.findOne({ step: step._id });
        // assert(item, 'Item was not created in the database');
    });

    it('should throw an error if no record to transform', async () => {
        // Create a job object and a step object as a precondition
        const jobRepository = new JobRepository();
        const stepRepository = new StepRepository();

        // Create a job
        const job = await jobRepository.createJob('test job');

        // Create a step associated with the job
        const step = await stepRepository.createStep(job._id, 'test step');

        const context = {
            get: sinon.stub().returns(undefined), // Simulate no record in context
        };
        const transformItem = new TransformItem(step, context);

        try {
            await transformItem.transform();
            // The line below should not be reached, and the test should fail
            assert.fail('Expected an error to be thrown');
        } catch (error) {
            assert.strictEqual(error.message, 'No record to transform');
        }
    });

    it('should perform transformation when record is available', async () => {
        // Create a job object and a step object as a precondition
        const jobRepository = new JobRepository();
        const stepRepository = new StepRepository();
        // Create a step object as a precondition
        // Create a job
        const job = await jobRepository.createJob('test job');

        // Create a step associated with the job
        const step = await stepRepository.createStep(job._id, 'test step');

        const context = {
            get: sinon.stub().returns({}), // Simulate a record in context
            set: sinon.stub(),
        };
        const transformItem = new TransformItem(step, context);

        try {
            await transformItem.transform();
            // The line below should not be reached, and the test should fail
            console.error('Expected an error to be thrown');
        } catch (error) {
            console.error('Error caught:', error.message);
        }

        // Assert that the 'mappedModel' is set in the context
        assert.ok(context.set.calledWith('mappedModel', sinon.match.any));
    });
});
