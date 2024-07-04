const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    maxlength: 16,
  },
  fullName: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    maxlength: 24,
  },
  permisson: {
    type: String,
    required: true,
  },
})

UserSchema.virtual('url').get(function () {
  return `/users/${this._id}`
})

module.exports = mongoose.model('User', UserSchema)
