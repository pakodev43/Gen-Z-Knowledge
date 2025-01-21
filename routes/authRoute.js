require('dotenv').config()
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()

const { uploadUserDp } = require('../middleware/filesUploadMiddleware')

const User = require('../models/User')


// Signup route
router.post('/register', uploadUserDp, async (req, res) => {
  
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    // return res.status(400).json({ message: 'User already exists.' });
    // return res.status(400).redirect('/register');
    return res.redirect('/register');
  }

  try {
      let hashedPassword = await bcrypt.hash(req.body.password, 10)

      let user = new User({
        email: req.body.email,
        password: hashedPassword,
        name: req.body.name,
        address: req.body.address,
        bio: req.body.bio,
        dp: req.file.filename
      });

      user = await user.save();
      
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIME })
      res.cookie('jwt', token)
      // res.status(201).json({ message: 'User created successfully.' });
      res.redirect('/profile')
    } catch (error) {
      // res.status(500).json({ message: 'Error registering user', error });
      // console.log(error)
      res.redirect('/register')
    }
});  


// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate('password')
    if (!user) {
      return res.redirect('/register')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.redirect('/login')
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIME })

    res.cookie('jwt', token)
    // res.json({ token: token });

    res.redirect('/profile')
    
  } catch (error) {
    // res.status(500).send('An error occured')
    // res.send(error)
    // console.log(error)
    res.redirect('/login')
  }
})


// Logout route
router.get('/logout', (req, res) => {
  var empty = ''
  jwt.sign({ empty }, 'secret', { expiresIn: "1s" })
  res.cookie('jwt', '', { maxAge: 0 })
  res.redirect('/login')
})


module.exports = router