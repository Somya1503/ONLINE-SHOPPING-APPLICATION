import mongoose from 'mongoose'
import Customer from '../models/customer.model.js'
import Product from '../models/product.model.js'

const invalidId = (id) => !mongoose.isValidObjectId(id)

export const getWishlist = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id)
            .populate({ path: 'wishlist', select: 'name description price category image stock createdAt' })
            .lean()
        if (!customer) return res.status(401).json({ success: false, message: 'Customer not found' })
        // Filter stale references if a product was deleted from the catalogue.
        const wishlist = (customer.wishlist || []).filter(Boolean)
        return res.status(200).json({ success: true, count: wishlist.length, wishlist })
    } catch (error) {
        console.error('Get wishlist error:', error)
        return res.status(500).json({ success: false, message: 'Unable to load wishlist' })
    }
}

export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params
        if (invalidId(productId)) return res.status(400).json({ success: false, message: 'Invalid product ID' })
        const product = await Product.findById(productId).select('_id')
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
        const customer = await Customer.findById(req.user._id)
        if (!customer) return res.status(401).json({ success: false, message: 'Customer not found' })
        if (customer.wishlist.some((id) => id.equals(product._id))) {
            return res.status(409).json({ success: false, message: 'Product is already in your wishlist' })
        }
        customer.wishlist.push(product._id)
        await customer.save()
        return res.status(201).json({ success: true, message: 'Product added to wishlist', count: customer.wishlist.length })
    } catch (error) {
        console.error('Add wishlist error:', error)
        return res.status(500).json({ success: false, message: 'Unable to add product to wishlist' })
    }
}

export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params
        if (invalidId(productId)) return res.status(400).json({ success: false, message: 'Invalid product ID' })
        const customer = await Customer.findById(req.user._id)
        if (!customer) return res.status(401).json({ success: false, message: 'Customer not found' })
        const index = customer.wishlist.findIndex((id) => id.equals(productId))
        if (index === -1) return res.status(404).json({ success: false, message: 'Product is not in your wishlist' })
        customer.wishlist.splice(index, 1)
        await customer.save()
        return res.status(200).json({ success: true, message: 'Product removed from wishlist', count: customer.wishlist.length })
    } catch (error) {
        console.error('Remove wishlist error:', error)
        return res.status(500).json({ success: false, message: 'Unable to remove product from wishlist' })
    }
}
