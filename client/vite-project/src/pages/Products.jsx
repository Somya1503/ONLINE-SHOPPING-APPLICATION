import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import { fetchProducts } from '../services/api'

const categories = ['All Categories', 'Electronics', 'Fashion', 'Books', 'Home']

const Products = () => {
    const [searchInput, setSearchInput] = useState('')
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All Categories')
    const [sort, setSort] = useState('newest')
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [retryKey, setRetryKey] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => setSearch(searchInput), 300)
        return () => clearTimeout(timer)
    }, [searchInput])

    useEffect(() => {
        let active = true
        setLoading(true)
        setError('')
        fetchProducts({ search, category, sort })
            .then((data) => { if (active) setProducts(data) })
            .catch((err) => {
                if (active) {
                    setError(err.response?.data?.message || 'Something went wrong while loading products.')
                    setProducts([])
                }
            })
            .finally(() => { if (active) setLoading(false) })
        return () => { active = false }
    }, [search, category, sort, retryKey])

    const title = useMemo(() => search ? `Results for “${search}”` : 'Discover products', [search])

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <section className="mb-9 overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-indigo-700 px-6 py-10 text-white sm:px-10 sm:py-14">
                    <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-indigo-200">SHOPKART • PRODUCT DISCOVERY</p>
                    <h1 className="max-w-2xl text-3xl font-black tracking-tight sm:text-5xl">Find something you'll love.</h1>
                    <p className="mt-4 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">Browse the catalogue, discover your next favourite, and explore the details.</p>
                </section>

                <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
                        <p className="mt-1 text-sm text-slate-500">Products are loaded live from the ShopKart API.</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3 md:w-3/5">
                        <label className="sm:col-span-1">
                            <span className="mb-1 block text-xs font-semibold text-slate-600">Search</span>
                            <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search products..." className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                        </label>
                        <label>
                            <span className="mb-1 block text-xs font-semibold text-slate-600">Category</span>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500">
                                {categories.map((item) => <option key={item} value={item}>{item}</option>)}
                            </select>
                        </label>
                        <label>
                            <span className="mb-1 block text-xs font-semibold text-slate-600">Sort by</span>
                            <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500">
                                <option value="newest">Newest</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                        </label>
                    </div>
                </div>

                {loading ? (
                    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center">
                        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
                        <p className="font-semibold text-slate-700">Loading products...</p>
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-12 text-center">
                        <p className="font-semibold text-rose-800">{error}</p>
                        <button onClick={() => setRetryKey((value) => value + 1)} className="mt-4 rounded-lg bg-rose-700 px-4 py-2 text-sm font-semibold text-white">Try again</button>
                    </div>
                ) : products.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
                        <div className="text-4xl">🛍️</div>
                        <h3 className="mt-3 text-lg font-bold text-slate-900">No products found.</h3>
                        <p className="mt-1 text-sm text-slate-500">Try another search or choose a different category.</p>
                        <button onClick={() => { setSearchInput(''); setSearch(''); setCategory('All Categories') }} className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">Clear filters</button>
                    </div>
                ) : (
                    <>
                        <p className="mb-4 text-sm text-slate-500">{products.length} {products.length === 1 ? 'product' : 'products'} found</p>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {products.map((product) => <ProductCard key={product._id} product={product} />)}
                        </div>
                    </>
                )}
                <div className="mt-10 text-center"><Link to="/home" className="text-sm font-semibold text-indigo-700 hover:underline">Back to home</Link></div>
            </main>
        </div>
    )
}

export default Products
