const mongoose = require('mongoose')

const Schema = mongoose.Schema

const MessageSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  name: {
    type: String,
  },
})

MessageSchema.virtual('url').get(function () {
  return `/messages/${this._id}`
})

module.exports = mongoose.model('Message', MessageSchema)
