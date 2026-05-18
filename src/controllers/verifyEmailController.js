const VerificationToken = require('../models/verificationToken')
const User = require('../models/User')

exports.verifyEmailController = async(req, res ) => {
    const {token, email} = req.query

    try {
        const verificationToken = await VerificationToken.findOne({token})
        if(!verificationToken){
            return res.status(400).json({
                succes: false,
                message: 'Invalid or expired token.'
            })
        }

        const user = await User.findById(verificationToken.userId)
        if( !user || user.email != email){
            return res.status(400).json({
                success: false,
                message: 'Invalid request.'
            })
        }
        
        user.isEmailVerified = true
        await user.save()

    } catch (error) {
        
    }
}