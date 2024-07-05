const mongoose = require('mongoose')
const dotenv = require('dotenv')

// connecting to a databse
dotenv.config()
const mongodb = process.env.MONGODB_URI
mongoose.set('strictQuery', false)

const connectDB = async () => {
  await mongoose
    .connect(mongodb)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err))
}

module.exports = connectDB
