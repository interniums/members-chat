const Message = require('../models/messageModel')

exports.getAllMessages = async () => {
  try {
    const messages = await Message.find({})
    return messages
  } catch (err) {
    console.log(err)
  }
}
