const mongoose = require('mongoose')
const slugify = require('slugify')

const User = require('./User')

courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    genre: {
        type: [String],
        enum: ['Technology', 'News', 'Philosophy', 'Medical', 'History', 'Startups', 'Academia', 'Mathematics', 'Mobiles', 'Computers', 'Gaming', 'Language', 'Programming', 'Computation', 'Designing', 'Business', 'Money', 'Innovations', 'Media', 'Cinema', 'App Launch', 'Hardware', 'Artificial Intelligence'],
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    chapters: {
        type: Array,
        required: true
    },
    chatLink: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    courseThumbnail: {
        type: String,
        required: true
    },
    courseIntroVideoId: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
})

// Slug generator
courseSchema.pre('validate', function (next) {
    if(this.title) this.slug = slugify(this.title, { lower: true, strict: true })
    next()
})

// Pre deletion middelware to update user schema while deleting a course
courseSchema.pre('remove', async function (next) {
    try {
        const userId = this.user;
        await User.findByIdAndUpdate(userId, {$pull: { course: this._id }});
        next();
    } catch (err) {
        next(err);
    }
});

// For search API
courseSchema.index({ title: "text" })

module.exports = mongoose.model('Course', courseSchema)