const mongoose = require('mongoose')
const {Schema} = mongoose

const verificationToken = new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token:{
        type: String,
        required: true
    },
    createAt:{
        type: Date,
        default: Date.now,
        expries: 3600 * 24
    }
})

module.exports = mongoose.model('VerificationToken', verificationToken)