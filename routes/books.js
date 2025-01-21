const express = require('express')
const router = express.Router()

const { uploadBookCover, uploadBook } = require('../middleware/filesUploadMiddleware')
const { isSignedIn } = require('../middleware/authMiddleware')

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


// View book, GET request
router.get('/:slug', async (req, res) => {
    let book = await Book.findOne({ slug: req.params.slug })
    
    res.sendFile(`${book.book}`, { root: './public/Assets/Books/' })
})


// Download book, GET request
router.get('/download/:slug', async (req, res) => {
    let book = await Book.findOne({ slug: req.params.slug })
    res.download(book.path, book.originalName)
})


// Use field names like this
// app.post('/rest/upload',
//     upload.fields([{
//       name: 'video', maxCount: 1
//     }, {
//       name: 'subtitles', maxCount: 1
//     }]), function(req, res, next){
// // ...
// }

// Add book details, POST request
router.post('/addBookDetails', isSignedIn, uploadBookCover, async (req, res) => {
    let userId = null
    if (req.id) {
        userId = req.id
    }
    let book = new Book({
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        user: userId,
        bookCover: req.file.filename

    })

    try {
        book = await book.save()
        res.redirect(`/books/addbook/${book.slug}`)
    } catch (e) {
        res.redirect('/books/add')
        console.log(e)
    }
})


// Add book, POST request
router.put('/addBook/:id', uploadBook, async (req, res) => {
    let book = await Book.findById(req.params.id)

    book.book = req.file.filename
    book.path = req.file.path
    book.originalName = req.file.originalname

    try {
        book = await book.save()
        res.redirect('/books')
    } catch (e) {
        res.redirect('/books/add')
        console.log(e)
    }
})


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