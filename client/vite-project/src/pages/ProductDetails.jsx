import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import { ErrorState, PanelLoading } from '../components/States'
import { ArrowLeftIcon, BagIcon, CheckIcon, PackageIcon, ShieldIcon } from '../components/Icons'
import { fetchProduct } from '../services/api'
import { useCart } from '../context/CartContext'
import { money, onImageError } from '../utils/format'

const ProductDetails = () => {
    const { id } = useParams()
    const { addToCart } = useCart()
    const [adding, setAdding] = useState(false)
    const [added, setAdded] = useState(false)
    const [cartError, setCartError] = useState('')
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true
        setLoading(true)
        setError('')
        setAdded(false)
        fetchProduct(id)
            .then((data) => { if (active) setProduct(data) })
            .catch((err) => {
                if (active) setError(err.response?.status === 404 ? 'This product could not be found.' : (err.response?.data?.message || 'Something went wrong while loading this product.'))
            })
            .finally(() => { if (active) setLoading(false) })
        return () => { active = false }
    }, [id])

    const handleAdd = async () => {
        setAdding(true); setCartError(''); setAdded(false)
        try { await addToCart(product._id); setAdded(true) }
        catch (error) { setCartError(error.response?.data?.message || 'Unable to add to cart. Please log in and try again.') }
        finally { setAdding(false) }
    }

    const stock = Number(product?.stock)

    return (
        <Layout width="max-w-6xl">
            <Link to="/products" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"><ArrowLeftIcon size={16} />Back to products</Link>
            {loading ? <PanelLoading label="Loading product…" />
                : error ? <ErrorState message={error} />
                : product && (
                    <div className="grid gap-8 md:grid-cols-2 lg:gap-14">
                        <div className="self-start overflow-hidden rounded-2xl border border-line bg-brand-soft md:sticky md:top-24">
                            <img src={product.image} alt={product.name} onError={onImageError} className={`aspect-square w-full object-cover ${stock > 0 ? '' : 'opacity-50 grayscale'}`} />
                        </div>
                        <div className="flex flex-col">
                            <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="w-fit rounded-full bg-brand-soft px-3.5 py-1.5 text-sm font-semibold text-brand hover:bg-brand hover:text-white">{product.category}</Link>
                            <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl">{product.name}</h1>
                            <p className="mt-4 font-display text-4xl font-bold">{money(product.price)}</p>
                            <p className={`mt-4 inline-flex items-center gap-2 text-sm font-semibold ${stock > 0 ? 'text-brand' : 'text-coral'}`}>
                                <span className={`h-2 w-2 rounded-full ${stock > 0 ? (stock <= 5 ? 'bg-saffron' : 'bg-brand') : 'bg-coral'}`} />
                                {stock > 0 ? (stock <= 5 ? `Only ${stock} left in stock` : `${stock} in stock`) : 'Currently out of stock'}
                            </p>
                            <p className="mt-6 max-w-prose leading-7 text-muted">{product.description}</p>

                            <button type="button" disabled={stock <= 0 || adding} onClick={handleAdd} className="btn btn-primary mt-8 w-full py-4 text-base sm:w-auto sm:px-12">
                                <BagIcon size={18} />{adding ? 'Adding…' : stock > 0 ? 'Add to cart' : 'Unavailable'}
                            </button>
                            {added && (
                                <p role="status" className="mt-4 flex flex-wrap items-center gap-2 rounded-md bg-brand-soft px-4 py-3 text-sm font-semibold text-brand">
                                    <CheckIcon size={16} />Added to your cart. <Link to="/cart" className="underline">View cart</Link>
                                </p>
                            )}
                            {cartError && <p role="alert" className="mt-4 rounded-md bg-coral-soft px-4 py-3 text-sm text-coral">{cartError}</p>}

                            <ul className="mt-10 space-y-3 border-t border-line pt-6 text-sm text-muted">
                                <li className="flex items-center gap-3"><ShieldIcon size={18} className="text-brand" />Pay securely with Razorpay at checkout</li>
                                <li className="flex items-center gap-3"><PackageIcon size={18} className="text-brand" />Follow your order status under My orders</li>
                            </ul>
                        </div>
                    </div>
                )}
        </Layout>
    )
}

export default ProductDetails
