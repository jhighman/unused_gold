// services/ItemReader.js

const fs = require('fs');
const csv = require('csv-parser');
const logger = require('../utils/logger'); // Adjust the path as per your project structure

function readCSV(filePath) {
  logger.info(`Starting to read CSV file: ${filePath}`);

  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        logger.info(`Completed reading CSV file: ${filePath}`);
        resolve(results);
      })
      .on('error', (error) => {
        logger.error(`Error reading CSV file: ${filePath}`, error);
        reject(error);
      });
  });
}

module.exports = { readCSV };
