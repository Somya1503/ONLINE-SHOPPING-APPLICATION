import { useState } from 'react'
import { Link } from 'react-router-dom'
import { addWishlistProduct, removeWishlistProduct } from '../services/api'
import { useCart } from '../context/CartContext'

const ProductCard = ({ product }) => {
    const inStock = Number(product.stock) > 0
    const { addToCart } = useCart()
    const [adding, setAdding] = useState(false)
    const [cartMessage, setCartMessage] = useState('')
    const [saved, setSaved] = useState(false)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')

    const handleAddToCart = async () => {
        if (adding || !inStock) return
        setAdding(true); setCartMessage('')
        try { await addToCart(product._id); setCartMessage('Added to cart.'); }
        catch (error) { setCartMessage(error.response?.data?.message || 'Unable to add to cart. Please log in and try again.'); }
        finally { setAdding(false); }
    }

    const toggleWishlist = async () => {
        if (saving) return
        setSaving(true)
        setMessage('')
        try {
            if (saved) {
                await removeWishlistProduct(product._id)
                setSaved(false)
            } else {
                await addWishlistProduct(product._id)
                setSaved(true)
            }
        } catch (error) {
            if (error.response?.status === 409 && !saved) setSaved(true)
            setMessage(error.response?.status === 409 ? 'Already in your wishlist.' : (error.response?.data?.message || 'Unable to update wishlist. Please log in and try again.'))
        } finally {
            setSaving(false)
        }
    }

    return (
        <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="relative">
                <Link to={`/products/${product._id}`} className="block overflow-hidden bg-slate-100">
                    <img src={product.image} alt={product.name} className="h-56 w-full object-cover transition duration-300 group-hover:scale-105" onError={(event) => { event.currentTarget.src = 'https://placehold.co/600x400/f1f5f9/64748b?text=ShopKart+Product' }} />
                </Link>
                <button type="button" onClick={toggleWishlist} disabled={saving} aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'} className={`absolute right-3 top-3 rounded-full px-4 py-2 text-sm font-bold shadow transition disabled:opacity-60 ${saved ? 'bg-rose-600 text-white' : 'bg-white text-slate-800 hover:bg-rose-50'}`}>
                    {saving ? 'Saving…' : saved ? '♥ Saved' : '♡ Wishlist'}
                </button>
            </div>
            <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{product.category}</span>
                    <span className={`text-xs font-semibold ${inStock ? 'text-emerald-700' : 'text-rose-600'}`}>{inStock ? `${product.stock} units left` : 'Out of stock'}</span>
                </div>
                <h2 className="line-clamp-2 min-h-12 text-lg font-bold text-slate-900">{product.name}</h2>
                <p className="text-xl font-extrabold text-slate-900">{Number(product.price).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })}</p>
                {message && <p role="alert" className="text-sm text-rose-700">{message}</p>}
                {cartMessage && <p role="status" className={`text-sm ${cartMessage.startsWith('Added') ? 'text-emerald-700' : 'text-rose-700'}`}>{cartMessage}</p>}
                <div className="grid grid-cols-2 gap-2"><Link to={`/products/${product._id}`} className="rounded-xl border border-slate-200 px-3 py-3 text-center text-sm font-semibold text-slate-800 hover:bg-slate-50">View Details</Link><button type="button" disabled={!inStock || adding} onClick={handleAddToCart} className="rounded-xl bg-indigo-700 px-3 py-3 text-sm font-semibold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-slate-300">{adding ? 'Adding…' : 'Add to Cart'}</button></div>
            </div>
        </article>
    )
}

export default ProductCard
