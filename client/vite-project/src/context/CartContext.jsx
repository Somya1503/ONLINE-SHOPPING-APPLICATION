import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { addCartProduct, fetchCart, removeCartProduct, updateCartProduct } from '../services/api';

const CartContext = createContext(null);
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const refreshCart = useCallback(async () => {
        setLoading(true); setError('');
        try { const items = await fetchCart(); setCartItems(items); return items; }
        catch (err) { setError(err.response?.data?.message || 'Unable to load your cart. Please log in and try again.'); throw err; }
        finally { setLoading(false); }
    }, []);

    useEffect(() => {
        const refresh = () => refreshCart().catch(() => {});
        window.addEventListener('cart-refresh', refresh);
        return () => window.removeEventListener('cart-refresh', refresh);
    }, [refreshCart]);

    const addToCart = useCallback(async id => {
        const data = await addCartProduct(id); setCartItems(data.cart || []); setError('');
        window.dispatchEvent(new CustomEvent('cart-updated')); return data;
    }, []);
    const updateQuantity = useCallback(async (id, quantity) => {
        const data = await updateCartProduct(id, quantity); setCartItems(data.cart || []);
        window.dispatchEvent(new CustomEvent('cart-updated')); return data;
    }, []);
    const removeFromCart = useCallback(async id => {
        const data = await removeCartProduct(id); setCartItems(data.cart || []);
        window.dispatchEvent(new CustomEvent('cart-updated')); return data;
    }, []);
    const clearCart = useCallback(() => {
        setCartItems([]); setError(''); window.dispatchEvent(new CustomEvent('cart-updated'));
    }, []);

    const value = useMemo(() => ({
        cartItems, setCartItems, loading, error, refreshCart, addToCart, updateQuantity, removeFromCart, clearCart,
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: cartItems.reduce((sum, item) => sum + Number(item.product?.price || 0) * item.quantity, 0)
    }), [cartItems, loading, error, refreshCart, addToCart, updateQuantity, removeFromCart, clearCart]);
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used inside CartProvider');
    return context;
};
