const express = require('express')
const router = express.Router()

const { authenticate } = require('../middleware/authMiddleware') 
const { uploadCourseThumbnail } = require('../middleware/filesUploadMiddleware')

const User = require('../models/User')
const Course = require('../models/Course')
const Article = require('../models/Article')
const Book = require('../models/Book')


//------ Normal Routes

router.get('/', async (req, res) => {
    let course = await Course.find().populate('user', 'name')
    let article = await Article.find().limit(2)
    let book = await Book.find().limit(4)
    
    res.render('courses', { course, article, book })
})


// Search API
router.get('/search', async (req, res) => {
    const { searchQuery } = req.query;
    
    let course = await Course.find({$text: {$search: searchQuery}})
    let article = await Article.find().limit(2)
    let book = await Book.find().limit(4)
    
    res.render('courses', { course, article, book })
})


// Category route, GET request
router.get('/category/:genre', async (req, res) => {
    let course = await Course.find({ genre: req.params.genre })
    let article = await Article.find({ genre: req.params.genre }).limit(4)
    let book = await Book.find({ genre: req.params.genre }).limit(4)

    res.render('courses', { course, article, book })
})


//---------- Authentication required Routes

// Add new course page route, GET request
router.get('/add', authenticate, (req, res) => {
    res.render('addcourse', { course: new Course() })
})


// Edit course page route, GET request
router.get('/edit/:id', authenticate, async (req, res) => {
    let course = await Course.findById(req.params.id)
    res.render('editcourse', { course: course })
})


// Add new course route, POST request
router.post('/addCourse', authenticate, uploadCourseThumbnail,  async (req, res) => {

    var user = await User.findById(req.id)

    var introVideoRawUrl = req.body.introVideoRawUrl;
    if (introVideoRawUrl) {
        var courseIntroVideoId = new URL(introVideoRawUrl).searchParams.get('v');
    } else {
        var courseIntroVideoId = null;
    }


    let course = new Course({
        title: req.body.title,
        genre: req.body.genre,
        duration: req.body.duration,
        chapters: req.body.chapters,
        chatLink: req.body.chatLink,
        courseIntroVideoId: courseIntroVideoId,
        desc: req.body.desc,
        courseThumbnail: req.file.filename,
        user: req.id
    
    })

    try {
        course = await course.save()

        await User.findByIdAndUpdate(req.id,{ $push: { course: course._id } },{ new: true });

        res.redirect(`/courses/${course.slug}`)
    } catch (e) {
        res.redirect('/courses/add')
        console.log(e)
    }
})


// Edit course route, PUT request
router.put('/edit/:id', authenticate, async (req, res) => {
    let course = await Course.findById(req.params.id)

    course.title = req.body.title
    course.duration = req.body.duration
    course.chatLink = req.body.chatLink
    course.desc = req.body.desc

    try {
        course = await course.save()
        res.redirect(`/courses/${course.slug}`)
    } catch (e) {
        console.log(e)
        res.redirect('/courses/edit/:id')
    }
})


// Delete course route, DELETE request
router.delete('/delete/:id', authenticate, async (req, res) => {
    await Course.findByIdAndDelete(req.params.id)
    res.redirect('/profile')
})


// Individual Course Route
router.get('/:slug', async (req, res) => {
    let course = await Course.findOne({ slug: req.params.slug }).populate('user', 'name address bio dp')
    res.render('showcourse', { course: course })
})


module.exports = router