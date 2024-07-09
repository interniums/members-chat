var session = require('express-session')
var MongoStore = require('connect-mongo')
const { clear } = require('console')
require('dotenv')

const sessionMiddleware = session({
  name: 'some_session_name',
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
  }),
  cookie: { secure: true, httpOnly: true },
})

module.exports = sessionMiddleware
