require('dotenv').config()
const mongodb = require('mongodb')
const { MongoClient } = require('mongodb')

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

const bookBucket = (req, res, next) => {
    MongoClient.connect(DB_URI).then(client => {
        const dbName = new URL(DB_URI).pathname.substring(1)
        const db = client.db(dbName);
        var bucket = new mongodb.GridFSBucket(db, { bucketName: 'bookBucket' });
        req.bookBucket = bucket
        next()
    })
}


module.exports = { userDpBucket, articleThumbnailBucket, courseThumbnailBucket, bookCoverBucket, bookBucket }