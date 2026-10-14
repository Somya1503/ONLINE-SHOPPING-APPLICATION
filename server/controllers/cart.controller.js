import mongoose from 'mongoose';
import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';

const invalidId = id => !mongoose.isValidObjectId(id);
const populatedCart = async customerId => {
    const customer = await Customer.findById(customerId)
        .populate({ path: 'cart.product', select: 'name description price category image stock createdAt' });
    return (customer?.cart || []).filter(item => item.product).map(item => ({
        product: item.product, quantity: item.quantity
    }));
};

export const getCart = async (req, res) => {
    try {
        const cart = await populatedCart(req.user._id);
        return res.json({ success: true, cart });
    } catch (error) {
        console.error('Get cart error:', error);
        return res.status(500).json({ success: false, message: 'Unable to load your cart' });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.params;
        if (invalidId(productId)) return res.status(400).json({ success: false, message: 'Invalid product ID' });
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        const customer = await Customer.findById(req.user._id);
        const item = customer.cart.find(row => row.product.equals(product._id));
        const nextQuantity = (item?.quantity || 0) + 1;
        if (nextQuantity > product.stock) return res.status(400).json({ success: false, message: `Only ${product.stock} unit(s) available for ${product.name}` });
        if (item) item.quantity = nextQuantity;
        else customer.cart.push({ product: product._id, quantity: 1 });
        await customer.save();
        return res.status(200).json({ success: true, message: 'Cart updated', cart: await populatedCart(customer._id) });
    } catch (error) {
        console.error('Add cart error:', error);
        return res.status(500).json({ success: false, message: 'Unable to add product to cart' });
    }
};

export const updateCartQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const quantity = req.body.quantity;
        if (invalidId(productId)) return res.status(400).json({ success: false, message: 'Invalid product ID' });
        if (!Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ success: false, message: 'Quantity must be an integer of at least 1' });
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        if (quantity > product.stock) return res.status(400).json({ success: false, message: `Only ${product.stock} unit(s) available` });
        const customer = await Customer.findById(req.user._id);
        const item = customer.cart.find(row => row.product.equals(productId));
        if (!item) return res.status(404).json({ success: false, message: 'Product is not in your cart' });
        item.quantity = quantity;
        await customer.save();
        return res.json({ success: true, cart: await populatedCart(customer._id) });
    } catch (error) {
        console.error('Update cart error:', error);
        return res.status(500).json({ success: false, message: 'Unable to update quantity' });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        if (invalidId(productId)) return res.status(400).json({ success: false, message: 'Invalid product ID' });
        const customer = await Customer.findById(req.user._id);
        const before = customer.cart.length;
        customer.cart = customer.cart.filter(row => !row.product.equals(productId));
        if (before === customer.cart.length) return res.status(404).json({ success: false, message: 'Product is not in your cart' });
        await customer.save();
        return res.json({ success: true, message: 'Product removed', cart: await populatedCart(customer._id) });
    } catch (error) {
        console.error('Remove cart error:', error);
        return res.status(500).json({ success: false, message: 'Unable to remove product' });
    }
};
