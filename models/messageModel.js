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
})

module.exports = mongoose.model('Message', MessageSchema)
