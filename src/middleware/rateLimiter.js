const rateLimit = require('express-rate-limit')

const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   //15 minitues
    max: 5,
    message: {
        success: false,
        message: 'Too many registration attempts, Please try again after 15 minitues'
    },
    standardHeaders: true,  // return rate limit information in headers
    legacyHeaders: false
})

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   //15 minitues
    max: 10,
    message: {
        success: false,
        message: 'Too many login attempts, Please try again after 15 minitues'
    },
    standardHeaders: true,  // return rate limit information in headers
    legacyHeaders: false
})

const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   //15 minitues
    max: 10,
    message: {
        success: false,
        message: 'Too many refresh attempts, Please try again after 15 minitues'
    },
    standardHeaders: true,  // return rate limit information in headers
    legacyHeaders: false
})

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   //15 minitues
    max: 100,
    message: {
        success: false,
        message: 'Too many attempts, Please try again after 15 minitues'
    },
    standardHeaders: true,  // return rate limit information in headers
    legacyHeaders: false
})


module.exports = {
    registerLimiter,
    loginLimiter,
    refreshLimiter,
    apiLimiter
}