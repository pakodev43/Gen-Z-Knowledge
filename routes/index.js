const express = require('express')
const router = express.Router()

const { authenticate, isSignedIn } = require('../middleware/authMiddleware')

const Article = require('../models/Article')
const Book = require('../models/Book')
const Course = require('../models/Course')
const User = require('../models/User')

// Index page
router.get('/', isSignedIn, async (req, res) => {
    let article = await Article.find().limit(4)
    let book = await Book.find().limit(4)
    let course = await Course.find().limit(4).populate('user', 'name')
    let signedIn = await User.findById(req.id)
    
    res.render('index', { article, book, course, signedIn })
})

// Register page
router.get('/register',isSignedIn, async (req, res) => {
    let signedIn = await User.findById(req.id)

    if (signedIn) {
        res.redirect('profile')
    } else {
        res.render('register')
    }
})

// Login page
router.get('/login',isSignedIn, async (req, res) => {
    let signedIn = await User.findById(req.id)
    
    if (signedIn) {
        res.redirect('profile')
    } else {
        res.render('login')
    }
})

// Profile page
router.get('/profile', authenticate, async (req, res) => {
    let user = await User.findById(req.id)
    let article = await Article.find({ user: req.id })
    let course = await Course.find({ user: req.id })
    let book = await Book.find({ user: req.id })

    res.render('profile', { user, article, course, book })
})

// Contact page
router.get('/contact', async (req, res) => {
    res.render('contact')
})

// About page
router.get('/about', async (req, res) => {
    res.render('about')
})

module.exports = router