var express = require('express')
var router = express.Router()
const mainController = require('../controllers/mainController')

// home page
router.get('/', mainController.index)

router.get('/sign-up', mainController.sign_up_get)
router.post('/sign-up', mainController.sign_up_post)

router.get('/sign-in', mainController.sign_in_get)
router.post('/sign-in', mainController.sign_in_post)

module.exports = router
