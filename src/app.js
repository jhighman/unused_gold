const express = require('express');
const logger = require('./utils/logger');
const errorHandler = require('./utils/errorHandler');
//const connectDB = require('./config/dbConnection'); // Import the database connection
const { connectDB } = require('./config/dbConnection'); // Adjust the path as necessary


// Load environment variables
require('dotenv').config();

// Initialize express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define your routes here
app.get('/', (req, res) => {
  res.send('Welcome to the unused_gold server!');
});

// Add more routes and middleware as needed
// ...

// Error handling middleware
app.use(errorHandler);

module.exports = app;
