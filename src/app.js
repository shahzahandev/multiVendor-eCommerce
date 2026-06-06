require('dotenv').config()
require('node:dns/promises').setServers(['1.1.1.1', '8.8.8.8']);
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')

const authRouter = require('./routes/auth')
const adminRouter = require('./routes/admin')

const swaggerSpecs = require('./config/swagger')
const swaggerUi = require('swagger-ui-express');
const { apiLimiter } = require('./middleware/rateLimiter');
const app = express()

// middleware
app.use(express.json({ limit: '10kb' }))
app.use(cors({
    origin: process.env.FRONEND_URL || 'http://localhost:5173',
    Credentials: true
}))
app.use(cookieParser())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

// Routes
app.use('/api/v1', apiLimiter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/admin', adminRouter)


// MongoDB conection
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('MongoDB connected successfully.')
    })
    .catch((error) => {
        console.log('MongoDB connection ERROR.', error)
    })

// port
let port = process.env.PORT || 5000 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
