// tests/upload.test.js
const request = require('supertest');
const path = require('path');
const app = require('../src/app'); // Adjust the path as necessary

describe('File Upload', () => {
    
  it('should upload a file', async () => {
    const response = await request(app)
      .post('/upload')
      .attach('file', path.join(__dirname, 'sample.csv')); // Ensure this file exists in your test directory

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('File uploaded successfully.');
  });

  // Add more tests as necessary
});
