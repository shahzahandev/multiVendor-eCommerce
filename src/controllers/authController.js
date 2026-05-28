const User = require("../models/User")
const VerificationToken = require("../models/verificationToken")
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const nodemailer = require('nodemailer')
const { v4: uuidv4 } = require('uuid')
const verificationToken = require("../models/verificationToken")

exports.registerController = async (req, res) => {
    try {
        let { name, email, password, phone, role } = req.body

        // If user don't fill the input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                messagez: 'Name, Email, Password are Required.'
            })
        }
        // If user already avaiable
        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User already existed'
            })
        }

        // Create user
        let user = new User({
            name: name,
            email: email,
            password: password,
            phone: phone || undefined,
            role: role || 'customer'
        })
        // Save user
        await user.save()

        // Create verification token
        const token = uuidv4()
        await new verificationToken({ userId: user._id, token }).save()

        // Send mail
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        })

        const verificationUrl = `${process.env.APP_URL}/api/v1/auth/verify-email?token=${token}$email=${user.email}`

        const mailOption = {
            from: ` "Multivendor Shop", <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Verify your email - Multivendor Ecommerce.',
            html: `
                   <h2> Wellcome to our platform </h2>
                   <p> Hi ${user.name} </p>
                   <p> Thanks for registration, Please verify your email by clicking the link below. </p>
                   <a herf=${verificationUrl}> Veirify email. </a>
                   <p> This link will be expire in 24 housrs </p>
                   <p> Best regards, <br> Team Multivendor </p>
                   `
        }

        try {
            await transporter.sendMail(mailOption)
            console.log('Email send.')
        } catch (error) {
            console.log('ERROR')
        }

        // Create user message
        return res.status(201).json({
            success: true,
            message: `Registration successfull, Please, login.`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
        // Server error message
    } catch (error) {
        console.log('Registration Error: error');
        return res.status(500).json({
            success: false,
            message: 'Server error during Registration.',
            error: error.message
        })
    }
}

exports.loginController = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password required."
            })
        }

        // Find user and select password
        const user = await User.findOne({ email }.select("+password"))
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            })
        }

        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            })
        }
        // Genarate token
        const accessToken = jwt.sign(
            { id: user._id, user: user.role, email: user.email },
            process.env.ACCESS_TOKEN,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        )

        // Refresh token
        const RefreshToken = jwt.sign(
            { id: user._id },
            process.env.REFRESH_TOKEN,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
        )

        // Save refresh token to user
        user.reFreshTokens.push({
            token: RefreshToken,
            createdAt: new Date(),
            // expiresAt: new Date(Date.now() + 7*24*60*60*1000)
        })
        await user.save()

        res.cookie('reFreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV == 'production',
            smaSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        })

        res.status(200).json({
            success: true,
            message: 'Login successufull.',
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified
            }
        })

    } catch (error) {
        console.log('Login Error: error');
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error
        })
    }
}

exports.refreshTokenController = async (req, res) => {
    try {
        const reFreshToken = req.cookies.reFreshToken

        if (!reFreshToken0)
            return res.status(400).json({
                success: false,
                message: 'No refresh token'
            })

        // Find user with refresh token

        const user = await User.findOne({
            refreshToken: {
                $elemMatch: {
                    token: reFreshToken
                }
            }
        })

        if (!user) {
            res.clearCookie('reFreshToken')
            return res.status(403).json({
                success: false,
                message: 'Invalid refresh token'
            })
        }

        // Verify refresh toekn
        jwt.verify(reFreshToken, process.env.REFRESH_TOKEN, async (err, decoded) => {
            if (!err) {
                res.clearCookie('reFreshToken')
                return res.status(403).json({
                    success: false,
                    message: 'Invalid refresh token'
                })
            }

            const newAccessToken = jwt.sign(
                { id: user._id, role: user.role, email: user.email },
                process.env.ACCESS_TOKEN,
                { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
            )

            res.status(200).json({
                success: true,
                accessToken: newAccessToken
            })


        })

    } catch (error) {
        console.log('Login Error: error');
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error
        })
    }
}