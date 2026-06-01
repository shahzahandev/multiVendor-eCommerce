const express = require('express')
const router = express.Router()
const { registerController, loginController, refreshTokenController } = require('../controllers/authController')
const { verifyEmailController } = require('../controllers/verifyEmailController')
const validate = require('../middleware/validate')
const { registrationSchema, loginSchema } = require('../validation/auth.validation')
const { registerLimiter, loginLimiter, refreshLimiter } = require('../middleware/rateLimiter')

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [customer, vendor]
 *
 *     responses:
 *       201:
 *         description: User registered successfully
 *
 *       400:
 *         description: Validation error
 *
 *       500:
 *         description: Internal server error
 */

router.post('/register', registerLimiter, validate(registrationSchema), registerController)
router.post('/register', loginLimiter, validate(loginSchema), registerController)
router.get('/verify-email', verifyEmailController)
router.post('/login', loginController)
router.post('/refreshToken', refreshLimiter, refreshTokenController)


module.exports = router