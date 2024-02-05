const express = require('express');
const multer = require('multer');
const logger = require('./utils/logger');
const errorHandler = require('./utils/errorHandler');
require('dotenv').config();
const { connectDB } = require('./config/dbConnection'); // Adjust the path as necessary
const GridFsStorage = require('multer-gridfs-storage');
const mongoose = require('mongoose');

// Initialize express
const app = express();

// Connect to MongoDB
connectDB();

const connection = mongoose.createConnection(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


let storage = new GridFsStorage({  
  url: process.env.DB_URI,  
  file: (req, file) => {    
         return {      
              bucketName: 'test',       
              //Setting collection name, default name is fs      
              filename: file.originalname     
              //Setting file name to original name of file    
       }  
 }
}); 



const upload = multer({ storage });

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes for file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    logger.info('File uploaded successfully');
    res.send({
      message: 'File uploaded successfully',
      file: req.file
    });
  } else {
    res.status(400).send({ message: 'Please upload a file' });
  }
});

// Define your routes here
app.get('/', (req, res) => {
  res.send('Welcome to the unused_gold server!');
});

// Add more routes and middleware as needed
// ...

// Error handling middleware
app.use(errorHandler);

module.exports = app;
