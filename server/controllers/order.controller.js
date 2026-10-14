import crypto from 'crypto';
import mongoose from 'mongoose';
import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import { getRazorpay } from '../config/razorpay.js';

const validateAddress = address => {
    const fields = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
    if (!address || fields.some(field => typeof address[field] !== 'string' || !address[field].trim())) return 'All shipping fields are required.';
    if (!/^[+\d][\d\s()-]{7,19}$/.test(address.phone.trim())) return 'Enter a valid phone number.';
    if (!/^\d{6}$/.test(address.pincode.trim())) return 'Pincode must contain 6 digits.';
    return '';
};

export const createPaymentOrder = async (req, res) => {
    let shopKartOrder;
    try {
        const shippingAddress = req.body.shippingAddress;
        const addressError = validateAddress(shippingAddress);
        if (addressError) return res.status(400).json({ success: false, message: addressError });
        const customer = await Customer.findById(req.user._id);
        if (!customer || !customer.cart?.length) return res.status(400).json({ success: false, message: 'Your cart is empty.' });

        const items = [];
        let totalAmount = 0;
        for (const cartItem of customer.cart) {
            const product = await Product.findById(cartItem.product);
            if (!product) return res.status(400).json({ success: false, message: 'A product in your cart is no longer available. Please update your cart.' });
            if (cartItem.quantity > product.stock) return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}. Available: ${product.stock}.` });
            items.push({ product: product._id, name: product.name, price: product.price, quantity: cartItem.quantity, image: product.image });
            totalAmount += product.price * cartItem.quantity;
        }
        totalAmount = Math.round((totalAmount + Number.EPSILON) * 100) / 100;
        shopKartOrder = await Order.create({
            user: customer._id, items, shippingAddress: Object.fromEntries(
                ['fullName','phone','addressLine1','city','state','pincode'].map(key => [key, shippingAddress[key].trim()])
            ), totalAmount
        });
        const razorpay = getRazorpay();
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(totalAmount * 100), currency: 'INR', receipt: shopKartOrder._id.toString()
        });
        shopKartOrder.razorpayOrderId = razorpayOrder.id;
        await shopKartOrder.save();
        return res.status(201).json({
            success: true, shopKartOrderId: shopKartOrder._id.toString(),
            razorpayOrderId: razorpayOrder.id, amount: razorpayOrder.amount,
            currency: razorpayOrder.currency, key: process.env.RAZORPAY_KEY_ID,
            totalAmount: shopKartOrder.totalAmount
        });
    } catch (error) {
        console.error('Create payment order error:', error);
        if (shopKartOrder && !shopKartOrder.razorpayOrderId) {
            await Order.findByIdAndDelete(shopKartOrder._id).catch(() => {});
        }
        return res.status(500).json({ success: false, message: error.message?.includes('Razorpay Test Mode keys') ? error.message : 'Unable to start checkout. Your cart has not been changed.' });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { shopKartOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        if (![shopKartOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature].every(value => typeof value === 'string' && value)) {
            return res.status(400).json({ success: false, message: 'Payment verification details are incomplete.' });
        }
        if (!mongoose.isValidObjectId(shopKartOrderId)) return res.status(400).json({ success: false, message: 'Invalid order ID.' });
        const order = await Order.findOne({ _id: shopKartOrderId, user: req.user._id });
        if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
        if (order.paymentStatus === 'PAID') return res.json({ success: true, order, message: 'Payment already verified.' });
        if (!order.razorpayOrderId || order.razorpayOrderId !== razorpay_order_id) return res.status(400).json({ success: false, message: 'Payment order does not match.' });
        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) return res.status(500).json({ success: false, message: 'Razorpay Test Mode keys are not configured on the server.' });
        const expected = crypto.createHmac('sha256', secret)
            .update(`${order.razorpayOrderId}|${razorpay_payment_id}`).digest();
        let supplied;
        try { supplied = Buffer.from(razorpay_signature, 'hex'); } catch { supplied = Buffer.alloc(0); }
        if (expected.length !== supplied.length || !crypto.timingSafeEqual(expected, supplied)) {
            return res.status(400).json({ success: false, message: 'Invalid payment signature. Your cart has not been cleared.' });
        }

        // Re-check stock immediately before completing the order.
        for (const item of order.items) {
            const updated = await Product.findOneAndUpdate(
                { _id: item.product, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } },
                { new: true }
            );
            if (!updated) {
                order.paymentStatus = 'FAILED';
                await order.save();
                return res.status(409).json({ success: false, message: `Stock changed for ${item.name}. Contact support with order ${order._id}.` });
            }
        }
        order.paymentStatus = 'PAID';
        order.status = 'PLACED';
        order.razorpayPaymentId = razorpay_payment_id;
        await order.save();
        await Customer.findByIdAndUpdate(req.user._id, { $set: { cart: [] } });
        return res.json({ success: true, message: 'Payment verified and order placed.', order });
    } catch (error) {
        console.error('Verify payment error:', error);
        return res.status(500).json({ success: false, message: 'Unable to verify payment.' });
    }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
        return res.json({ success: true, orders });
    } catch (error) {
        console.error('Get orders error:', error);
        return res.status(500).json({ success: false, message: 'Unable to load orders.' });
    }
};

export const getOrderById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid order ID.' });
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).lean();
        if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
        return res.json({ success: true, order });
    } catch (error) {
        console.error('Get order error:', error);
        return res.status(500).json({ success: false, message: 'Unable to load order.' });
    }
};
