// src/config/dbConnection.js

const mongoose = require('mongoose');
const logger = require('../utils/logger');
const Grid = require('gridfs-stream');

const connectDB = () => {
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => logger.info('Connected to MongoDB'))
      .catch((error) => logger.error('MongoDB connection error:', error));
};

let bucket;
mongoose.connection.on("connected", () => {
  var db = mongoose.connections[0].db;
  bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "newBucket"
  });
  console.log(bucket);
});

module.exports = {
    connectDB,
    getBucket: () => bucket
};
