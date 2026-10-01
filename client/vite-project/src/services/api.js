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
