const { body, validationResult } = require('express-validator')
const UserModel = require('../models/userModel')
const MessageModel = require('../models/messageModel')
const asyncHandler = require('express-async-handler')

exports.index = asyncHandler(async (req, res, next) => {
  const [allUsers, allMessages] = await Promise.all([
    UserModel.countDocuments({}).exec(),
    MessageModel.countDocuments({}).exec(),
  ])

  res.render('layout', {
    title: 'Wellcome to out members only chat!',
    users_count: allUsers,
    messages_count: allMessages,
  })
})

exports.sign_up_get = asyncHandler(async (req, res, next) => {
  res.render('sign-up-form')
})

exports.sign_up_post = asyncHandler()
