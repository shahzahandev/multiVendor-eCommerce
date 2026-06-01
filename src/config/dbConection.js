const mongoose = require('mongoose')

// MongoDB connetion
let mongodbConnect = () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => {
            console.log('MongoDB connected successfully.')
        })
        .catch((error) => {
            console.log('MongoDB connection ERROR.')
        })
}

module.exports = mongodbConnect

