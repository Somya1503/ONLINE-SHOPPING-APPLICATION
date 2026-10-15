import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import { EmptyState, ErrorState, PageHeader, ProductSkeletonGrid } from '../components/States'
import { SearchIcon } from '../components/Icons'
import { fetchProducts, fetchWishlist } from '../services/api'

const categories = ['All Categories', 'Electronics', 'Fashion', 'Books', 'Home']

const Products = () => {
    const [params, setParams] = useSearchParams()
    const search = params.get('search') || ''
    const category = params.get('category') || 'All Categories'
    const sort = params.get('sort') || 'newest'

    const [searchInput, setSearchInput] = useState(search)
    const [products, setProducts] = useState([])
    const [savedIds, setSavedIds] = useState(() => new Set())
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [retryKey, setRetryKey] = useState(0)

    const setParam = useCallback((key, value, fallback = '') => {
        setParams((prev) => {
            const next = new URLSearchParams(prev)
            if (!value || value === fallback) next.delete(key)
            else next.set(key, value)
            return next
        }, { replace: true })
    }, [setParams])

    const [prevSearch, setPrevSearch] = useState(search)
    if (search !== prevSearch) { setPrevSearch(search); setSearchInput(search) }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput.trim() !== search) setParam('search', searchInput.trim())
        }, 300)
        return () => clearTimeout(timer)
    }, [searchInput, search, setParam])

    useEffect(() => {
        let active = true
        fetchWishlist().then((items) => { if (active) setSavedIds(new Set(items.map((p) => p._id))) }).catch(() => {})
        return () => { active = false }
    }, [])

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

    const clearFilters = () => { setSearchInput(''); setParams({}, { replace: true }) }
    const title = search ? `Results for “${search}”` : category !== 'All Categories' ? category : 'All products'

    return (
        <Layout>
            <PageHeader title={title} subtitle={!loading && !error ? `${products.length} ${products.length === 1 ? 'product' : 'products'}` : undefined} />

            <div className="mb-8 space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <label htmlFor="product-search" className="sr-only">Search products</label>
                        <SearchIcon size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                        <input id="product-search" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search by product name" className="input !pl-10" />
                    </div>
                    <div className="sm:w-56">
                        <label htmlFor="product-sort" className="sr-only">Sort by</label>
                        <select id="product-sort" value={sort} onChange={(e) => setParam('sort', e.target.value, 'newest')} className="input">
                            <option value="newest">Newest first</option>
                            <option value="price_asc">Price: low to high</option>
                            <option value="price_desc">Price: high to low</option>
                        </select>
                    </div>
                </div>
                <div role="group" aria-label="Category" className="flex flex-wrap gap-2">
                    {categories.map((item) => (
                        <button key={item} type="button" aria-pressed={category === item} onClick={() => setParam('category', item, 'All Categories')} className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${category === item ? 'border-brand bg-brand text-white' : 'border-line bg-white text-ink hover:border-ink'}`}>
                            {item === 'All Categories' ? 'All' : item}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? <ProductSkeletonGrid />
                : error ? <ErrorState message={error} onRetry={() => setRetryKey((v) => v + 1)} />
                : products.length === 0 ? (
                    <EmptyState icon={<SearchIcon size={26} />} title="No products match your search" text="Try a different word or pick another category."
                        action={<button onClick={clearFilters} className="btn btn-primary mt-6 px-6">Clear filters</button>} />
                ) : (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                        {products.map((product) => <ProductCard key={product._id} product={product} initialSaved={savedIds.has(product._id)} />)}
                    </div>
                )}
        </Layout>
    )
}

export default Products
