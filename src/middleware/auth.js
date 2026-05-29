const jwt = require('jsonwebtoken')


const protect = async (req, res, next) => {
    let token ;

    if(req.headers.authorization && req.headers.authorization.startWith('Bearer')){
        token = req.headers.authorization.split('')[1]
    }

    if(!token){
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN)
        req.user = decoded
        next()
    } catch (error) {
         return res.status(401).json({
            success: false,
            message: 'Not authorized, no failed'
        })
    }
}


const restrictTo = async (...roles) => {
   return (req, res, next) => {
    if(!roles.includes(req.user.role)){
        return res.status(403).json({
            success: false,
            message: 'You do not have permission'
        })
        next()
    }
   }
}

module.exports = {protect, restrictTo}