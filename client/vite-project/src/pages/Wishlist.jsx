import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { fetchWishlist, removeWishlistProduct } from '../services/api'

const Wishlist = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [removingId, setRemovingId] = useState('')

    const loadWishlist = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            setProducts(await fetchWishlist())
        } catch (err) {
            setError(err.response?.data?.message || 'We couldn\'t load your wishlist. Please sign in and try again.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { loadWishlist() }, [loadWishlist])

    const handleRemove = async (productId) => {
        setRemovingId(productId)
        setError('')
        try {
            await removeWishlistProduct(productId)
            setProducts((current) => current.filter((product) => product._id !== productId))
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to remove this product. Please try again.')
        } finally {
            setRemovingId('')
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-rose-600">Saved for later</p><h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">My Wishlist <span aria-hidden="true">♥</span></h1><p className="mt-2 text-slate-500">{products.length} {products.length === 1 ? 'product' : 'products'} saved</p></div>
                    <Link to="/products" className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-bold text-slate-700 hover:border-indigo-300 hover:text-indigo-700">Continue shopping</Link>
                </div>

                {loading ? <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center"><div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600"/><p className="font-semibold text-slate-700">Loading your wishlist...</p></div>
                    : error && products.length === 0 ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-14 text-center"><h2 className="text-xl font-bold text-rose-900">Something went wrong.</h2><p className="mt-2 text-rose-800">{error}</p><button onClick={loadWishlist} className="mt-5 rounded-xl bg-rose-700 px-5 py-3 font-semibold text-white hover:bg-rose-800">Try Again</button></div>
                        : products.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center"><div className="text-5xl">♡</div><h2 className="mt-4 text-2xl font-black text-slate-900">Your wishlist is empty</h2><p className="mt-2 text-slate-500">Save products you love and find them here later.</p><Link to="/products" className="mt-6 inline-flex rounded-xl bg-indigo-700 px-6 py-3 font-bold text-white hover:bg-indigo-800">Browse Products</Link></div>
                            : <>
                                {error && <p role="alert" className="mb-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {products.map((product) => <article key={product._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                        <Link to={`/products/${product._id}`} className="block bg-slate-100"><img src={product.image} alt={product.name} onError={(event) => { event.currentTarget.src = 'https://placehold.co/600x400/f1f5f9/64748b?text=ShopKart+Product' }} className="h-52 w-full object-cover" /></Link>
                                        <div className="space-y-3 p-5"><span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{product.category}</span><h2 className="min-h-12 text-lg font-bold text-slate-900">{product.name}</h2><p className="text-xl font-extrabold text-slate-900">{Number(product.price).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })}</p><p className={`text-sm font-semibold ${product.stock > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>{product.stock > 0 ? `${product.stock} units left` : 'Currently out of stock'}</p><Link to={`/products/${product._id}`} className="block rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-700">View Details</Link><button onClick={() => handleRemove(product._id)} disabled={removingId === product._id} className="w-full rounded-xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-60">{removingId === product._id ? 'Removing…' : 'Remove from Wishlist'}</button></div>
                                    </article>)}
                                </div>
                            </>}
            </main>
        </div>
    )
}

export default Wishlist
