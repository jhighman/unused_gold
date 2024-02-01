// repositories/FileVaultRepository.js

const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const fs = require('fs');
const path = require('path');

class FileVaultRepository {
    constructor() {
        // GridFS Stream will be initialized once the DB connection is open
        this.gfs = null;
        this.initGridFS();
    }

    initGridFS() {
        const conn = mongoose.connection;
        conn.once('open', () => {
            this.gfs = Grid(conn.db, mongoose.mongo);
            this.gfs.collection('fileVault');
            console.log('GridFS initialized.');
        });
    }

    isGridFSInitialized() {
        return !!this.gfs;
    }

    async storeFile(filePath) {
        return new Promise((resolve, reject) => {
            if (!this.isGridFSInitialized()) {
                reject(new Error('GridFS is not initialized'));
                return;
            }

            const readStream = fs.createReadStream(filePath);
            const writeStream = this.gfs.createWriteStream({
                filename: path.basename(filePath),
                metadata: {
                    isArchived: true,
                    isPending: false,
                    isError: false
                }
            });

            readStream.pipe(writeStream);

            writeStream.on('close', (file) => {
                console.log('File stored in GridFS:', file.filename);
                resolve(file);
            });

            writeStream.on('error', (error) => {
                console.error('Error storing file in GridFS:', error);
                reject(error);
            });
        });
    }
}

module.exports = FileVaultRepository;
