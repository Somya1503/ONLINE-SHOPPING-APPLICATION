import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { fetchProduct } from '../services/api'

const ProductDetails = () => {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true
        setLoading(true)
        setError('')
        fetchProduct(id)
            .then((data) => { if (active) setProduct(data) })
            .catch((err) => {
                if (active) setError(err.response?.status === 404 ? 'Product not found.' : (err.response?.data?.message || 'Something went wrong while loading this product.'))
            })
            .finally(() => { if (active) setLoading(false) })
        return () => { active = false }
    }, [id])

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <Link to="/products" className="mb-6 inline-flex text-sm font-semibold text-indigo-700 hover:underline">← Back to products</Link>
                {loading ? <div className="py-24 text-center font-semibold text-slate-600">Loading product...</div>
                    : error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-800">{error}</div>
                        : product && (
                            <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:grid-cols-2">
                                <div className="min-h-72 bg-slate-100">
                                    <img src={product.image} alt={product.name} onError={(event) => { event.currentTarget.src = 'https://placehold.co/900x900/f1f5f9/64748b?text=ShopKart+Product' }} className="h-full max-h-[620px] min-h-72 w-full object-cover" />
                                </div>
                                <div className="flex flex-col justify-center p-6 sm:p-10">
                                    <span className="w-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">{product.category}</span>
                                    <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{product.name}</h1>
                                    <p className="mt-5 text-3xl font-extrabold text-slate-900">{Number(product.price).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                                    <p className="mt-5 leading-7 text-slate-600">{product.description}</p>
                                    <p className={`mt-5 text-sm font-semibold ${product.stock > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>{product.stock > 0 ? `${product.stock} units in stock` : 'Currently out of stock'}</p>
                                    <button type="button" disabled={product.stock <= 0} onClick={() => window.alert('Cart functionality will be available in a later lab.')} className="mt-8 rounded-xl bg-indigo-700 px-6 py-4 font-bold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-slate-300">Add to Cart</button>
                                    <p className="mt-3 text-xs text-slate-400">Cart is a UI-only feature for this lab.</p>
                                </div>
                            </div>
                        )}
            </main>
        </div>
    )
}

export default ProductDetails
