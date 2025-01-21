const mongoose = require('mongoose')
const slugify = require('slugify')

const User = require('./User')

bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: [String],
        // enum: ['Technology', 'News', 'History', 'Startups', 'Academia', 'Mathematics', 'Mobiles', 'Computers', 'Gaming', 'Language', 'Programming', 'Computation', 'Designing', 'Business', 'Money', 'Innovations', 'Media', 'Cinema', 'App Launch', 'Hardware', 'Artificial Intelligence'],
        enum: ['Technology', 'News', 'Medical', 'Academia', 'Mathematics', 'Future', 'Economy', 'Philosophy', 'Languages', 'Programming', 'Artificial Intelligence'],
        required: true
    },
    author: {
        type: String
    },
    bookCover: {
        type: String
    },
    book: {
        type: String
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    path:{
        type: String
    },
    originalName:{
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

// Slug generator
bookSchema.pre('validate', function (next) {
    if(this.title) this.slug = slugify(this.title, { lower: true, strict: true })
    next()
})

// For search API
bookSchema.index({ title: "text", author: "text" })

module.exports = mongoose.model('Book', bookSchema)