const { body, validationResult } = require('express-validator')
const User = require('../models/userModel')
const Message = require('../models/messageModel')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const passport = require('passport')

exports.index = asyncHandler(async (req, res, next) => {
  const [allUsers, allMessages] = await Promise.all([
    User.countDocuments({}).exec(),
    Message.countDocuments({}).exec(),
  ])

  res.render('home-page', {
    title: 'Wellcome to out members only chat!',
    users_count: allUsers,
    messages_count: allMessages,
  })
})

exports.sign_up_get = asyncHandler(async (req, res, next) => {
  res.render('sign-up-form', {
    errors: [],
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
      })
    } else {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password_up, salt)

      const user = new User({
        username: username_up,
        password: hashedPassword,
        permission: 'not_a_member',
      })

      await user.save()
      res.redirect('/')
    }
  }),
]
