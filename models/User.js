const mongoose = require('mongoose')
const slugify = require('slugify')

const Article = require('./Article')
const Course = require('./Course')
const Book = require('./Book')

userSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'contributor', 'admin'],
        default: 'user'
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    dp: {
        type: String
    },
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
})

// Slug generator
userSchema.pre('validate', function (next) {
    if(this.name) this.slug = slugify(this.name + this.createdAt, { lower: true, strict: true })
    next()
})

// Ensure password, and address is excluded by default in all queries
userSchema.pre(/^find/, function (next) {
    this.select('-password -address');
    next();
});

// Pre deletion middelware to delete courses realted to user
// userSchema.pre('remove', async function (next) {
//     try {
//         await Course.deleteMany({ user: this._id });
//         next();
//     } catch (err) {
//         next(err);
//     }
// });

// For search API
// userSchema.index({ name: "text" })

module.exports = mongoose.model('User', userSchema)