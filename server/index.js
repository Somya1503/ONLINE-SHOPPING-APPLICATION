
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import customerRoutes from './routes/customer.routes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config()

console.log("DB URL:", process.env.dbUrl)

const app = express()

const PORT = 8089


console.log("Starting MongoDB connection...")

mongoose.connect(process.env.dbUrl)
.then(() => {
    console.log("✅ DB Connected")
})
.catch((err) => {
    console.log("❌ DB Connection Failed")
    console.log(err.name)
    console.log(err.message)
})


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))


app.use(express.json())

app.use(cookieParser())


app.use('/customers', customerRoutes)


app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`)
})