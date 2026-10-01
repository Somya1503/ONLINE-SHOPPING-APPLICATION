import mongoose from 'mongoose'
import Product from '../models/product.model.js'

const productFields = ['name', 'description', 'price', 'category', 'image', 'stock']

export const createProduct = async (req, res) => {
    try {
        const missing = productFields.filter((field) =>
            req.body[field] === undefined || req.body[field] === null || req.body[field] === ''
        )
        if (missing.length) {
            return res.status(400).json({ success: false, message: `Missing required field(s): ${missing.join(', ')}` })
        }
        const price = Number(req.body.price)
        const stock = Number(req.body.stock)
        if (!Number.isFinite(price) || price <= 0) {
            return res.status(400).json({ success: false, message: 'Price must be a number greater than 0' })
        }
        if (!Number.isInteger(stock) || stock < 0) {
            return res.status(400).json({ success: false, message: 'Stock must be a non-negative integer' })
        }
        const product = await Product.create({ ...req.body, price, stock })
        return res.status(201).json({ success: true, product })
    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ success: false, message: error.message })
        }
        console.error('Create product error:', error)
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

export const getProducts = async (req, res) => {
    try {
        const query = {}
        const search = String(req.query.search || '').trim()
        const category = String(req.query.category || '').trim()
        if (search) query.name = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' }
        if (category && category.toLowerCase() !== 'all') query.category = category

        const sortOptions = {
            price_asc: { price: 1 },
            price_desc: { price: -1 },
            newest: { createdAt: -1 }
        }
        const sort = sortOptions[req.query.sort] || { createdAt: -1 }
        const products = await Product.find(query)
            .select('name description price category image stock createdAt')
            .sort(sort)
            .lean()
        return res.status(200).json({ success: true, count: products.length, products })
    } catch (error) {
        console.error('Get products error:', error)
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: 'Invalid product ID' })
        }
        const product = await Product.findById(id).lean()
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
        return res.status(200).json({ success: true, product })
    } catch (error) {
        console.error('Get product error:', error)
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}
