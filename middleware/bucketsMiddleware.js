require('dotenv').config()
const mongodb = require('mongodb')
const mongoose = require('mongoose')
const multer = require('multer')
const { MongoClient } = require('mongodb')
const Grid = require('gridfs-stream');
const { GridFsStorage } = require('multer-gridfs-storage')

const DB_URI = process.env.DB_URI;

const userDpBucket = (req, res, next) => {
    MongoClient.connect(DB_URI).then(client => {
        const dbName = new URL(DB_URI).pathname.substring(1)
        const db = client.db(dbName);
        var bucket = new mongodb.GridFSBucket(db, { bucketName: 'userDpBucket' });
        req.userDpBucket = bucket
        next()
    })
}

const articleThumbnailBucket = (req, res, next) => {
    MongoClient.connect(DB_URI).then(client => {
        const dbName = new URL(DB_URI).pathname.substring(1)
        const db = client.db(dbName);
        var bucket = new mongodb.GridFSBucket(db, { bucketName: 'articleThumbnailBucket' });
        req.articleThumbnailBucket = bucket
        next()
    })
}

const courseThumbnailBucket = (req, res, next) => {
    MongoClient.connect(DB_URI).then(client => {
        const dbName = new URL(DB_URI).pathname.substring(1)
        const db = client.db(dbName);
        var bucket = new mongodb.GridFSBucket(db, { bucketName: 'courseThumbnailBucket' });
        req.courseThumbnailBucket = bucket
        next()
    })
}

const bookCoverBucket = (req, res, next) => {
    MongoClient.connect(DB_URI).then(client => {
        const dbName = new URL(DB_URI).pathname.substring(1)
        const db = client.db(dbName);
        var bucket = new mongodb.GridFSBucket(db, { bucketName: 'bookCoverBucket' });
        req.bookCoverBucket = bucket
        next()
    })
}

const readBookBucket = (req, res, next) => {
    MongoClient.connect(DB_URI).then(client => {
        const dbName = new URL(DB_URI).pathname.substring(1)
        const db = client.db(dbName);
        var bucket = new mongodb.GridFSBucket(db, { bucketName: 'bookBucket' });
        req.readBookBucket = bucket
        next()
    })
}


const conn = mongoose.createConnection(DB_URI)

let writeBookBucket;
conn.once('open', () => {
    writeBookBucket = Grid(conn.db, mongoose.mongo);
    writeBookBucket.collection('bookBucket');
});


module.exports = { userDpBucket, articleThumbnailBucket, courseThumbnailBucket, bookCoverBucket, writeBookBucket, readBookBucket }