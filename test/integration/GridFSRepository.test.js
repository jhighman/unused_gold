// tests/integration/GridFSRepository.test.js

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { connectDB } = require('../../src/config/dbConnection');
const GridFSRepository = require('../../src/repositories/GridFSRepository');

describe('GridFSRepository Integration', function() {
    let gridFSRepo;

    before(async function() {
        // Ensure you are connecting to a test database
        await connectDB();
        gridFSRepo = new GridFSRepository();
    });

    it('should upload a file to GridFS', async function() {
        // Note: Adjust the filename to 'sample.csv' and ensure the file path is correct
        const filename = 'sample.csv';
        // Adjust the file path to point to the 'fixtures' directory where 'sample.csv' is located
        const filepath = path.join(__dirname, 'fixtures', filename);
        const readStream = fs.createReadStream(filepath);

        // Upload file
        const fileId = await gridFSRepo.uploadFile(readStream, filename);
        assert.ok(fileId, 'File ID should be returned');

        // Assuming getFileById and deleteFile methods are implemented in GridFSRepository
        // Attempt to retrieve the file to verify upload
        const fileBuffer = await gridFSRepo.getFileById(fileId);
        assert.ok(fileBuffer, 'File buffer should not be null');
        assert.ok(fileBuffer.length > 0, 'File buffer should contain data');

        // Optionally, verify the contents of the file
        const fileContent = fileBuffer.toString();
        const expectedContent = fs.readFileSync(filepath, { encoding: 'utf8' });
        assert.strictEqual(fileContent, expectedContent, 'Uploaded file content should match the original');

        // Clean up: Delete the test file from GridFS
        await gridFSRepo.deleteFile(fileId);
    });

    // Additional tests and after hooks to close DB connection if necessary
});
