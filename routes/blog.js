const express = require('express')
const router = express.Router()

const { uploadArticleThumbnail } = require('../middleware/filesUploadMiddleware')
const { authenticate } = require('../middleware/authMiddleware')

const Article = require('../models/Article')
const Book = require('../models/Book')
const Course = require('../models/Course')
const User = require('../models/User')


// Main route
router.get('/', async (req, res) => {
    let article = await Article.find()
    let book = await Book.find().limit(4)
    let course = await Course.find().limit(4)
    
    res.render('blog', { article, book, course })
})


// Search API
router.get('/search', async (req, res) => {
    const { searchQuery } = req.query;
    
    let article = await Article.find({$text: {$search: searchQuery}})
    let book = await Book.find().limit(4)
    let course = await Course.find().limit(4)
    
    res.render('blog', { article, book, course })
})


// Category route, GET request
router.get('/category/:genre', async (req, res) => {
    let article = await Article.find({ genre: req.params.genre })
    let book = await Book.find({ genre: req.params.genre }).limit(4)
    let course = await Course.find({ genre: req.params.genre }).limit(4)

    res.render('blog', { article, book, course })
})


//--------- Authentication required Routes

// Add new article page, GET request
router.get('/write', authenticate, (req, res) => {
    res.render('writearticle', { article: new Article() })
})


// Edit article page, GET request
router.get('/edit/:id', authenticate, async (req, res) => {
    let article = await Article.findById(req.params.id)
    res.render('editarticle', { article: article })
})


// Add new article route, POST request
router.post('/new', authenticate, uploadArticleThumbnail,  async (req, res) => {
    var user = await User.findById(req.id)

    let article = new Article({
        title: req.body.title,
        genre: req.body.genre,
        text: req.body.text,
        articleThumbnail: req.file.filename,
        user: req.id
    
    })

    try {
        article = await article.save()

        await User.findByIdAndUpdate(req.id,{ $push: { article: article._id } },{ new: true });

        res.redirect(`/blog/${article.slug}`)
    } catch (e) {
        res.redirect('/blog/write')
        console.log(e)
    }
})


// Edit article route, PUT request
router.put('/edit/:id', authenticate, async (req, res) => {
    let article = await Article.findById(req.params.id)

    article.title = req.body.title
    article.text = req.body.text

    try {
        article = await article.save()
        res.redirect(`/blog/${article.slug}`)
    } catch (e) {
        console.log(e)
        res.redirect('/blog/edit/:id')
    }
})


// Delete article route, DELETE request
router.delete('/delete/:id', authenticate, async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/profile')
})


// Individual article page, GET request
router.get('/:slug', async (req, res) => {
    // let article = await Article.findOne({ slug: req.params.slug })
    let article = await Article.findOne({ slug: req.params.slug }).populate('user', 'name')
    res.render('showarticle', { article: article })
})


module.exports = router