const multer = require('multer')


// User's Dp Upload
var dpStorage = multer.memoryStorage()
var uploadUserDp = multer({ storage: dpStorage }).single('dp')

// Article's Thumbnail Image Upload
var articleThumbnailStorage = multer.memoryStorage()
var uploadArticleThumbnail = multer({ storage: articleThumbnailStorage }).single('articleThumbnail')

// Course Thumbnail Image Upload
var courseThumbnailStorage = multer.memoryStorage()
var uploadCourseThumbnail = multer({ storage: courseThumbnailStorage }).single('courseThumbnail')

// Book Cover Image Upload
var bookCoverStorage = multer.memoryStorage()
var uploadBookCover = multer({ storage: bookCoverStorage }).single('bookCover')

// Books Upload
var bookStorage = multer.memoryStorage()
var uploadBook = multer({ storage: bookStorage }).single('book')


module.exports = { uploadUserDp, uploadArticleThumbnail, uploadCourseThumbnail, uploadBookCover, uploadBook }