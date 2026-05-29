require('dotenv').config()
require('node:dns/promises').setServers(['1.1.1.1','8.8.8.8']);
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth')
const { config } = require('dotenv')
const mongodbConnect = require('./config/dbConection')
const app = express()

// middleware
app.use(express.json({ limit: '10kb' }))
app.use(cors({
    origin: process.env.FRONEND_URL || 'http://localhost:5173',
    Credentials: true
}))
app.use(cookieParser())

// Routes
app.use('/api/v1/auth', authRouter)

// MongoDB conection
// mongodbConnect()

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('MongoDB connected successfully')
    })
    .catch((error) => {
        console.log('MongoDB connection ERROR')
        console.log(error)
    })

// port
let port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
