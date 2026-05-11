const User = require("../models/User")
const jwt = require('jsonwebtoken')
const {validationResult } = require('express-validator')

exports.registerController = async(req, res) => {
   try {
        let {name, email, password, phone, role} = req.body
        // if user don't fill the input
        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                messagez: 'Name, Email, Password are Required.'
            })
        }
        // if user already avaiable
        const existingUser = await User.findOne({ email: email })
        if(existingUser){
            return res.status(409).json({
                success: false,
                message: 'User already existed'
            })
        }
        // create user
        let user = new User ({
            name: name,
            email: eamil,
            passwrod: password,
            phone: phone || undefined,
            role: role || 'customer'
        })

        await user.save()
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

   } catch (error) {
       return res.status(500).json({
        success: false,
        message: 'Server error during Registration.',
        error: error
       })
   }    
}