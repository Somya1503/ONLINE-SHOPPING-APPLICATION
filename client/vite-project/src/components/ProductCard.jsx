import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { addWishlistProduct, removeWishlistProduct } from '../services/api'
import { useCart } from '../context/CartContext'
import { money, onImageError } from '../utils/format'
import { BagIcon, CheckIcon, HeartIcon } from './Icons'

const ProductCard = ({ product, initialSaved = false, onUnsaved }) => {
    const stock = Number(product.stock)
    const inStock = stock > 0
    const { addToCart } = useCart()
    const [adding, setAdding] = useState(false)
    const [justAdded, setJustAdded] = useState(false)
    const [cartError, setCartError] = useState('')
    const [override, setSaved] = useState(null)
    const saved = override ?? initialSaved
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')
    const timer = useRef(null)

    useEffect(() => () => clearTimeout(timer.current), [])

    const handleAddToCart = async () => {
        if (adding || !inStock) return
        setAdding(true); setCartError('')
        try {
            await addToCart(product._id)
            setJustAdded(true)
            clearTimeout(timer.current)
            timer.current = setTimeout(() => setJustAdded(false), 2200)
        } catch (error) {
            setCartError(error.response?.data?.message || 'Unable to add to cart. Please log in and try again.')
        } finally { setAdding(false) }
    }

    const toggleWishlist = async () => {
        if (saving) return
        setSaving(true)
        setMessage('')
        try {
            if (saved) {
                await removeWishlistProduct(product._id)
                setSaved(false)
                onUnsaved?.(product._id)
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
        <article className="flex flex-col">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line bg-brand-soft">
                <Link to={`/products/${product._id}`} aria-label={`View ${product.name}`} className="block h-full">
                    <img src={product.image} alt={product.name} loading="lazy" onError={onImageError} className={`h-full w-full object-cover ${inStock ? '' : 'opacity-50 grayscale'}`} />
                </Link>
                <button type="button" onClick={toggleWishlist} disabled={saving} aria-pressed={saved} aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`} className={`absolute right-2.5 top-2.5 flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition-colors disabled:opacity-60 ${saved ? 'bg-coral text-white' : 'bg-white text-ink hover:text-coral'}`}>
                    <HeartIcon size={18} filled={saved} />
                </button>
                {!inStock && <span className="absolute bottom-2.5 left-2.5 rounded-md bg-white px-2.5 py-1 text-xs font-bold text-ink">Out of stock</span>}
                {inStock && stock <= 5 && <span className="absolute bottom-2.5 left-2.5 rounded-md bg-saffron px-2.5 py-1 text-xs font-bold text-ink">Only {stock} left</span>}
            </div>
            <div className="mt-3 flex flex-1 flex-col">
                <p className="text-xs font-medium text-muted">{product.category}</p>
                <h2 className="mt-1 line-clamp-2 min-h-[2.75rem] font-sans text-base font-semibold leading-snug">
                    <Link to={`/products/${product._id}`} className="hover:text-brand">{product.name}</Link>
                </h2>
                <p className="mt-1 font-display text-xl font-bold">{money(product.price)}</p>
                <div className="mt-auto pt-3">
                    <button type="button" disabled={!inStock || adding} onClick={handleAddToCart} className={`btn w-full ${justAdded ? 'bg-brand-soft text-brand' : 'btn-primary'}`}>
                        {justAdded ? <><CheckIcon size={16} />Added to cart</> : <><BagIcon size={16} />{adding ? 'Adding…' : inStock ? 'Add to cart' : 'Unavailable'}</>}
                    </button>
                </div>
                {(message || cartError) && <p role="alert" className="mt-2 text-sm text-coral">{message || cartError}</p>}
            </div>
        </article>
    )
}

export default ProductCard
