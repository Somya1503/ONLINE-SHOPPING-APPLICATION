import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { addToCart, getCart, removeFromCart, updateCartQuantity } from '../controllers/cart.controller.js';

const router = express.Router();
router.use(isAuthenticated);
router.get('/', getCart);
router.post('/:productId', addToCart);
router.patch('/:productId', updateCartQuantity);
router.delete('/:productId', removeFromCart);
export default router;
