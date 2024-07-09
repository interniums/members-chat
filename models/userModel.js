const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    maxlength: 16,
    unique: true,
  },
  fullName: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    maxlength: 99,
  },
  permission: {
    type: String,
    required: true,
  },
  admin: {
    type: String,
  },
})

UserSchema.virtual('url').get(function () {
  return `/users/${this._id}`
})

module.exports = mongoose.model('User', UserSchema)
