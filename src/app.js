const express = require('express');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const errorHandler = require('./utils/errorHandler');

// Load environment variables
require('dotenv').config();

// Initialize express
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => logger.info('Connected to MongoDB'))
.catch((error) => logger.error('MongoDB connection error:', error));

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define your routes here
// For example, a basic root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the unused_gold server!');
});

// Add more routes and middleware as needed
// ...

// Error handling middleware
app.use(errorHandler);

module.exports = app;
