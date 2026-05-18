const express = require('express')
const router = express.Router()
const {registerController} = require('../controllers/authController')
const {verifyEmailController} = require('../controllers/verifyEmailController')

router.post('/register', registerController)
router.get('/verify-email', verifyEmailController)

module.exports = router