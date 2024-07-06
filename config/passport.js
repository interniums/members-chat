var passport = require('passport')
var User = require('../models/userModel')
var bcrypt = require('bcrypt')
var LocalStrategy = require('passport-local')

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username })
      if (!user) {
        return done(null, false, { message: 'Incorrect username' })
      }

      const validate = await bcrypt.compare(password, user.password)
      if (!validate) {
        return done(null, false, { message: 'Incorrect password' })
      }
      return done(null, user)
    } catch (err) {
      return done(err)
    }
  })
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (error) {
    done(error)
  }
})
