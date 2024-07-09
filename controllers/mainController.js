const { body, validationResult } = require('express-validator')
const User = require('../models/userModel')
const Message = require('../models/messageModel')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const passport = require('passport')
const { getAllMessages } = require('../utils/getMessages')
require('connect-flash')

exports.index = asyncHandler(async (req, res, next) => {
  const [allUsers, allMessages] = await Promise.all([
    User.countDocuments({}).exec(),
    Message.countDocuments({}).exec(),
  ])
  const messages = await getAllMessages()

  res.render('home-page', {
    title: 'Wellcome to out members only chat!',
    users_count: allUsers,
    messages_count: allMessages,
    user: req.user,
    messages: messages,
  })
})

exports.sign_up_get = asyncHandler(async (req, res, next) => {
  res.render('sign-up-form', {
    errors: [],
    user: req.user,
  })
})

exports.sign_up_post = [
  body('username_up', 'Username must be more than 3 characters.')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('password_up', 'Password must be more than 8 characters.')
    .trim()
    .isLength({ min: 8 })
    .escape(),
  body('password_confirm_up', 'Confirm password.')
    .trim()
    .isLength({ min: 8 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const { username_up, password_up, password_confirm_up } = req.body
    const errors = validationResult(req)
    const existinguser = await User.findOne({ username: username_up })

    if (password_up !== password_confirm_up) {
      return res.status(403).render('sign-up-form', {
        errors: [{ msg: 'Password do not match.' }],
      })
    }

    if (existinguser) {
      return res.status(403).render('sign-up-form', {
        errors: [{ msg: 'Username already exist.' }],
      })
    }

    if (!errors.isEmpty()) {
      res.render('sign-up-form', {
        errors: errors.errors,
        user: req.user,
      })
    } else {
      const hashedPassword = await bcrypt.hash(password_up, 10)

      const user = new User({
        username: username_up,
        password: hashedPassword,
        permission: 'not_a_member',
        admin: false,
      })

      await user.save()
      res.redirect('/')
    }
  }),
]

exports.sign_in_get = asyncHandler(async (req, res, next) => {
  res.render('sign-in-form', {
    errors: [],
    user: req.user,
  })
})

exports.sign_in_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/sign-in',
  failureMessage: true,
})

exports.logout = asyncHandler(async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500)
    }
    res.redirect('/')
  })
})

exports.membership = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ username: req.user.username })
  user.permission = 'member'
  await user.save()
  res.redirect('/')
})

exports.message = asyncHandler(async (req, res, next) => {
  const message = new Message({
    text: req.body.message,
    author: req.user._id,
    name: req.user.username,
  })

  await message.save()
  res.redirect('/')
})

exports.delete_message = asyncHandler(async (req, res, next) => {
  const message = await Message.findByIdAndDelete(req.params.id)
  res.redirect('/')
})
