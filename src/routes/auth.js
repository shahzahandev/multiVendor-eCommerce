const express = require('express')
const router = express.Router()
const {registerController, loginController, refreshTokenController} = require('../controllers/authController')
const {verifyEmailController} = require('../controllers/verifyEmailController')

router.post('/register', registerController)
router.get('/verify-email', verifyEmailController)
router.post('/login', loginController)
router.post('/refreshToken', refreshTokenController)


module.exports = router