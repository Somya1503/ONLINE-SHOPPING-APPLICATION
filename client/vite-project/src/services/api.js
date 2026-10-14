import { axiosInstance } from '../axiosCalls/axios'

export const fetchProducts = async ({ search = '', category = '', sort = '' } = {}) => {
    const params = {}
    if (search.trim()) params.search = search.trim()
    if (category && category !== 'All Categories') params.category = category
    if (sort) params.sort = sort
    const response = await axiosInstance.get('/products', { params })
    return response.data.products || []
}

export const fetchProduct = async (id) => {
    const response = await axiosInstance.get(`/products/${id}`)
    return response.data.product
}

export const fetchWishlist = async () => {
    const response = await axiosInstance.get('/wishlist')
    return response.data.wishlist || []
}

export const addWishlistProduct = async (productId) => {
    const response = await axiosInstance.post(`/wishlist/${productId}`)
    window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: { count: response.data.count } }))
    return response.data
}

export const removeWishlistProduct = async (productId) => {
    const response = await axiosInstance.delete(`/wishlist/${productId}`)
    window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: { count: response.data.count } }))
    return response.data
}

// Shopping cart (authenticated customer cookie is sent by axios).
export const fetchCart = async () => {
    const response = await axiosInstance.get('/cart')
    return response.data.cart || []
}
export const addCartProduct = async (productId) => {
    const response = await axiosInstance.post(`/cart/${productId}`)
    return response.data
}
export const updateCartProduct = async (productId, quantity) => {
    const response = await axiosInstance.patch(`/cart/${productId}`, { quantity })
    return response.data
}
export const removeCartProduct = async (productId) => {
    const response = await axiosInstance.delete(`/cart/${productId}`)
    return response.data
}
export const createPaymentOrder = async (shippingAddress) => {
    const response = await axiosInstance.post('/orders/create-payment-order', { shippingAddress })
    return response.data
}
export const verifyPayment = async (payload) => {
    const response = await axiosInstance.post('/orders/verify-payment', payload)
    return response.data
}
export const fetchOrders = async () => {
    const response = await axiosInstance.get('/orders')
    return response.data.orders || []
}
export const fetchOrder = async (id) => {
    const response = await axiosInstance.get(`/orders/${id}`)
    return response.data.order
}
