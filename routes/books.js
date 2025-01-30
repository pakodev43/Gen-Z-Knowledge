require('dotenv').config()
const express = require('express')
const router = express.Router()
const mongodb = require('mongodb')
const multer = require('multer')
const { GridFsStorage } = require('multer-gridfs-storage')

const DB_URI = process.env.DB_URI;

const { isSignedIn } = require('../middleware/authMiddleware')
const { uploadBookCover } = require('../middleware/filesUploadMiddleware')
const { bookCoverBucket, writeBookBucket, readBookBucket } = require('../middleware/bucketsMiddleware')

router.use(bookCoverBucket)
router.use(readBookBucket)

const Book = require('../models/Book')
const Article = require('../models/Article')
const Course = require('../models/Course')


router.get('/', async (req, res) => {
    let book = await Book.find()
    let article = await Article.find().limit(2)
    let course = await Course.find().limit(4)

    res.render('books', { book, article, course })
})


// Search API
router.get('/search', async (req, res) => {
    const { searchQuery } = req.query;
    
    let book = await Book.find({$text: {$search: searchQuery}})
    let article = await Article.find().limit(2)
    let course = await Course.find().limit(4)

    res.render('books', { book, article, course })
})


// Category route, GET request
router.get('/category/:genre', async (req, res) => {
    let book = await Book.find({ genre: req.params.genre })
    let article = await Article.find({ genre: req.params.genre }).limit(4)
    let course = await Course.find({ genre: req.params.genre }).limit(4)

    res.render('books', { book, article, course })
})


// Add book page, GET request
router.get('/add', (req, res) => {
    res.render('addbookdetails', { book: new Book() })
})


// Add book page, GET request
router.get('/addbook/:slug', async (req, res) => {
    let book = await Book.findOne({ slug: req.params.slug })
    res.render('addbook', { book })
})


// Serve Book, GET request
router.get('/:filename', (req, res) => {
    req.readBookBucket.openDownloadStreamByName(req.params.filename).pipe(res);
});


// Download book, GET request
// router.get('/download/:slug', async (req, res) => {
//     let book = await Book.findOne({ slug: req.params.slug })
//     res.download(book.path, book.originalName)
// })


// Use field names like this
// app.post('/rest/upload',
//     upload.fields([{
//       name: 'video', maxCount: 1
//     }, {
//       name: 'subtitles', maxCount: 1
//     }]), function(req, res, next){
// // ...
// }

var bookSlug

// Add book details, POST request
router.post('/addBookDetails', isSignedIn, uploadBookCover, async (req, res) => {
    let userId = null
    if (req.id) {
        userId = req.id
    }

    var file = req.file
    var filename = req.body.title + "-cover-" + Date.now()

    const uploadStream = req.bookCoverBucket.openUploadStream(filename);
    uploadStream.end(file.buffer);

    let book = new Book({
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        user: userId,
        bookCover: filename

    })

    try {
        book = await book.save()
        bookSlug = book.slug
        res.redirect(`/books/addbook/${book.slug}`)
    } catch (e) {
        res.redirect('/books/add')
        console.log(e)
    }
})


const bookStorage = new GridFsStorage({
    url: DB_URI,
    file: (req, file) => {
        return { filename: bookSlug, bucketName: 'bookBucket' };
    },
});
var uploadBook = multer({ storage: bookStorage }).single('book')

// Add book, POST request
router.put('/addBook/:id', uploadBook, async (req, res) => {

    try {
        res.redirect('/books')
    } catch (e) {
        res.redirect('/books/add')
        console.log(e)
    }
})

// Serve Book Cover
router.get('/cover/:filename', (req, res) => {
    req.bookCoverBucket.openDownloadStreamByName(req.params.filename).pipe(res);
});

// router.post('/addBook', uploadBookCover, async (req, res) => {
// }, uploadBook)

// router.post('/addBook', uploadBookCover, uploadBook, async (req, res) => {
//     let book = new Book({
//         title: req.body.title,
//         author: req.body.author,
//         // Double file upload function
//         bookCover: req.file.filename,
//         book: req.file.filename

//     })

//     try {
//         book = await Book.save()
//         res.redirect(`/books/${book.slug}`)
//     } catch (e) {
//         res.redirect('/books/add')
//         console.log(e)
//     }
// })


// Delete book route, DELETE request
router.delete('/delete/:id', async (req, res) => {
    await Book.findByIdAndDelete(req.params.id)
    res.redirect('/profile')
})


module.exports = router