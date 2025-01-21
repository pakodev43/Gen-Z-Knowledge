require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const app = express()

// MongoDB Database
mongoose.connect(process.env.DB_URI)

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

// Routes
const indexRoute = require('./routes/index')
const blogRoute = require('./routes/blog')
const booksRoute = require('./routes/books')
const coursesRoute = require('./routes/courses')
const authRoute = require('./routes/authRoute')

app.use('/', indexRoute)
app.use('/blog', blogRoute)
app.use('/books', booksRoute)
app.use('/courses', coursesRoute)
app.use('/', authRoute)

// Run the server
app.listen(process.env.PORT, () => {
    if (process.env.PHASE == 'development') {
        console.log(`Server is running on http://localhost:${process.env.PORT} in development`)
    }
})