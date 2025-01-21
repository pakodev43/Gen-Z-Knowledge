require('dotenv').config()
const jwt = require('jsonwebtoken')

var cookieExtractor = function(req) {
  if (req && req.cookies) {
      token = req.cookies['jwt'];
  }
  return token;
};

const authenticate = (req, res, next) => {
  var token = null
  token = cookieExtractor(req)
  
  if (!token) {
    return res.redirect('/login')
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET)  
    req.id = verified.id
    next()
    
  } catch (error) {
    res.redirect('/login')
  }
}

const isSignedIn = (req, res, next) => {
  var token = null
  token = cookieExtractor(req)
  
  if (!token) {
    return next()
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET)  
    req.id = verified.id
    next()
    
  } catch (error) {
    res.redirect('/login')
  }
}

module.exports = { authenticate, isSignedIn }