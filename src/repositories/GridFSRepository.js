const mongoose = require('mongoose');

class GridFSRepository {
    constructor() {
        // Check if the mongoose connection is ready
        if (mongoose.connection.readyState !== 1) {
            throw new Error("MongoDB connection is not established.");
        }
        
        // Initialize GridFSBucket with the current mongoose connection
        this.bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: "uploads"
        });
    }

    async uploadFile(readStream, filename, options = {}) {
        // Returns a promise that resolves with the file ID of the uploaded file
        return new Promise((resolve, reject) => {
            const uploadStream = this.bucket.openUploadStream(filename, options);
            readStream.pipe(uploadStream)
                .on('error', (error) => reject(error))
                .on('finish', () => resolve(uploadStream.id.toString())); // Ensure the file ID is returned as a string
        });
    }

    async getFileById(fileId) {
        // Returns a promise that resolves with the file data as a Buffer
        return new Promise((resolve, reject) => {
            const id = new mongoose.Types.ObjectId(fileId); // Convert string ID to MongoDB ObjectId
            let data = [];
            this.bucket.openDownloadStream(id)
                .on('data', (chunk) => data.push(chunk))
                .on('error', (error) => reject(error))
                .on('end', () => resolve(Buffer.concat(data))); // Concatenate all chunks into a single Buffer
        });
    }

    async deleteFile(fileId) {
        // Returns a promise that resolves when the file is deleted
        return new Promise((resolve, reject) => {
            const id = new mongoose.Types.ObjectId(fileId); // Convert string ID to MongoDB ObjectId
            this.bucket.delete(id, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = GridFSRepository;
