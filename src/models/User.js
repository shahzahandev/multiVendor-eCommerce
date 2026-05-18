const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcryptjs')

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minLength: 2,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        unique: true,
        // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    phone: {
        type: String,
        unique: true,
        sparse: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: 8,
        select: false,
        // match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, 'Please enter a stronger password'],
    },
    role: {
        type: String,
        enum: ['customer', 'vendor', 'admin'],
        default: 'customer'
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    reFreshTokens: [{
        type: String,
        createdAt: {
            type: Date,
            default: Date.now
        },
        expiresAt:{
            type: Date
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true})


// password hash
userSchema.pre('save', async function(next) {
   if(!this.isModified('password'))  return next()

    let salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt) 
    next()
})

// password compare
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model("User", userSchema)