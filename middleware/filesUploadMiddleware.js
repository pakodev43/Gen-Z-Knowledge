const multer = require('multer')

// User's Dp Upload
var dpStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/Assets/UserDps')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var uploadUserDp = multer({ storage: dpStorage }).single('dp')


// Article's Thumbnail Image Upload
var articleThumbnailStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/Assets/ArticleThumbnails')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var uploadArticleThumbnail = multer({ storage: articleThumbnailStorage }).single('articleThumbnail')


// Course Thumbnail Image Upload
var courseThumbnailStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/Assets/CourseThumbnails')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var uploadCourseThumbnail = multer({ storage: courseThumbnailStorage }).single('courseThumbnail')


// Book Cover Image Upload
var bookCoverStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/Assets/BookCovers')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var uploadBookCover = multer({ storage: bookCoverStorage }).single('bookCover')


// Books Upload
var bookStorage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './public/Assets/Books')
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname)
  }
})
var uploadBook = multer({ storage: bookStorage }).single('book')


module.exports = { uploadUserDp, uploadArticleThumbnail, uploadCourseThumbnail, uploadBookCover, uploadBook }