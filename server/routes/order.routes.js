import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { createPaymentOrder, getOrderById, getOrders, verifyPayment } from '../controllers/order.controller.js';

const router = express.Router();
router.use(isAuthenticated);
router.post('/create-payment-order', createPaymentOrder);
router.post('/verify-payment', verifyPayment);
router.get('/', getOrders);
router.get('/:id', getOrderById);
export default router;
