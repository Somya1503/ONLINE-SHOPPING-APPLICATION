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
