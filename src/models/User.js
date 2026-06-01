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
        minLength: 5,
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
        expiresAt: {
            type: Date
        }
    }],
    shopName: {
        type: String,
        unique: true,
        sparse: true,
    },
    shopDescription: {
        type: String,
        trim: true,
        maxLength: 1000,
    },
    shopAddress: {
        type: String,
        trim: true,
    },
    shopLogo: {
        type: String,
    },
    nidNumber: {
        type: String,
        unique: true,
        sparse: true,
    },
    bankInfo: {
        bankName: String,
        branchName: String,
        accountNumber: String,
        accountHolder: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'suspended'],
        default: 'customer'
    },
    approvedAt: {
        type: Date,
    },
    rejectReason: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })


// password hash
userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) return
    let salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

//
userSchema.pre('save', function(next){
    if(!this.isModified('role') && this.role != 'vendor'){
        this.status = 'pending'
    }

    if(this.role != 'vendor'){
        this.status = 'customer'
        this.shopName = undefined
    }
    next()
})

// password compare
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model("User", userSchema)