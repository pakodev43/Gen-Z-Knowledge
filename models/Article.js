const mongoose = require('mongoose')
const slugify = require('slugify')

const User = require('./User')

articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: [String],
        enum: ['Technology', 'Philosophy', 'Medical', 'News', 'History', 'Startups', 'Academia', 'Mathematics', 'Mobiles', 'Computers', 'Gaming', 'Language', 'Programming', 'Computation', 'Designing', 'Business', 'Money', 'Innovations', 'Media', 'Cinema', 'App Launch', 'Hardware', 'Artificial Intelligence'],
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    text: {
        type: String,
        required: true
    },
    articleThumbnail: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
})

// Slug generator
articleSchema.pre('validate', function (next) {
    if(this.title) this.slug = slugify(this.title, { lower: true, strict: true })
    next()
})

// Pre deletion middelware to update user schema while deleting an article
articleSchema.pre('remove', async function (next) {
    try {
        const userId = this.user;
        await User.findByIdAndUpdate(userId, {$pull: { article: this._id }});
        next();
    } catch (err) {
        next(err);
    }
});

// For search API
articleSchema.index({ title: "text" })

module.exports = mongoose.model('Article', articleSchema)