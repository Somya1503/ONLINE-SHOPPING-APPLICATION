import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import { EmptyState, ErrorState, PageHeader, ProductSkeletonGrid } from '../components/States'
import { HeartIcon } from '../components/Icons'
import { fetchWishlist } from '../services/api'

const Wishlist = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const loadWishlist = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            setProducts(await fetchWishlist())
        } catch (err) {
            setError(err.response?.data?.message || 'We couldn\'t load your wishlist. Please log in and try again.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { loadWishlist() }, [loadWishlist])

    const handleUnsaved = (productId) => setProducts((current) => current.filter((product) => product._id !== productId))

    return (
        <Layout>
            <PageHeader
                title="Wishlist"
                subtitle={!loading && !error ? `${products.length} ${products.length === 1 ? 'product' : 'products'} saved` : undefined}
                action={<Link to="/products" className="btn btn-outline self-start sm:self-auto">Continue shopping</Link>}
            />
            {loading ? <ProductSkeletonGrid count={4} />
                : error ? <ErrorState message={error} onRetry={loadWishlist} />
                : products.length === 0 ? <EmptyState icon={<HeartIcon size={26} />} title="Your wishlist is empty" text="Tap the heart on any product to save it here." to="/products" cta="Browse products" />
                : (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                        {products.map((product) => <ProductCard key={product._id} product={product} initialSaved onUnsaved={handleUnsaved} />)}
                    </div>
                )}
        </Layout>
    )
}

export default Wishlist
