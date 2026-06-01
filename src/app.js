require('dotenv').config()
require('node:dns/promises').setServers(['1.1.1.1','8.8.8.8']);
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const authRouter = require('./routes/auth')
const mongodbConnect = require('./config/dbConection')
const swaggerSpecs = require('./config/swagger')
const swaggerUi = require('swagger-ui-express')
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
app.use('/api/v1/auth', authRouter)

// MongoDB conection
mongodbConnect()


// port
let port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
