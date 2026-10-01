import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import customerRoutes from './routes/customer.routes.js'
import productRoutes from './routes/product.routes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import wishlistRoutes from './routes/wishlist.routes.js';

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8089

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use('/customers', customerRoutes)
app.use('/products', productRoutes)
app.use('/wishlist', wishlistRoutes)

mongoose.connect(process.env.dbUrl)
    .then(() => console.log('✅ DB Connected'))
    .catch((err) => console.error('❌ DB Connection Failed:', err.message))

app.get('/health', (_req, res) => res.json({ success: true, message: 'ShopKart API is running' }))

app.listen(PORT, () => console.log(`Server Started at ${PORT}`))
