const User = require("../models/User")
const VerificationToken = require("../models/verificationToken")
const jwt = require('jsonwebtoken')
const {validationResult } = require('express-validator')
const nodemailer = require('nodemailer')
const {v4: uuidv4} = require('uuid')
const verificationToken = require("../models/verificationToken")

exports.registerController = async(req, res) => {
   try {
        let {name, email, password, phone, role} = req.body

        // If user don't fill the input
        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                messagez: 'Name, Email, Password are Required.'
            })
        }
        // If user already avaiable
        const existingUser = await User.findOne({ email: email })
        if(existingUser){
            return res.status(409).json({
                success: false,
                message: 'User already existed'
            })
        }

        // Create user
        let user = new User ({
            name: name,
            email: eamil,
            passwrod: password,
            phone: phone || undefined,
            role: role || 'customer'
        })
        // Save user
        await user.save()
        
        // Create verification token
        const token = uuidv4()
        await new verificationToken({userId: user._id, token}).save()

        // Send mail
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth:{
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
                   <p> Hi ${user.naem} </p>
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
       return res.status(500).json({
        success: false,
        message: 'Server error during Registration.',
        error: error
       })
   }    
}