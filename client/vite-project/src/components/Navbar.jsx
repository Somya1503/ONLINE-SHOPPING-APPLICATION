import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios'
import { fetchWishlist } from '../services/api'
import { useCart } from '../context/CartContext'
import { BagIcon, BrandMark, CloseIcon, HeartIcon, LogoutIcon, MenuIcon, SearchIcon } from './Icons'

const navLink = ({ isActive }) =>
    `border-b-2 py-1 text-sm font-semibold transition-colors ${isActive ? 'border-saffron text-ink' : 'border-transparent text-muted hover:text-ink'}`

const IconLink = ({ to, label, count, children }) => (
    <Link to={to} aria-label={count > 0 ? `${label}, ${count} ${count === 1 ? 'item' : 'items'}` : label} className="relative rounded-md p-2.5 text-ink transition-colors hover:bg-surface">
        {children}
        {count > 0 && <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-saffron px-1 text-[11px] font-bold leading-none text-ink">{count}</span>}
    </Link>
)

function Navbar() {
    const [loader, setLoader] = useState(false)
    const [wishlistCount, setWishlistCount] = useState(0)
    const [logoutError, setLogoutError] = useState('')
    const [menuOpen, setMenuOpen] = useState(false)
    const [query, setQuery] = useState('')
    const navigate = useNavigate()
    const { itemCount, refreshCart, clearCart } = useCart()

    useEffect(() => {
        let active = true
        fetchWishlist().then((items) => { if (active) setWishlistCount(items.length) }).catch(() => {})
        refreshCart().catch(() => {})
        const updateCount = (event) => {
            if (typeof event.detail?.count === 'number') setWishlistCount(event.detail.count)
            else fetchWishlist().then((items) => setWishlistCount(items.length)).catch(() => {})
        }
        window.addEventListener('wishlist-updated', updateCount)
        const updateCart = () => refreshCart().catch(() => {})
        window.addEventListener('cart-updated', updateCart)
        return () => { active = false; window.removeEventListener('wishlist-updated', updateCount); window.removeEventListener('cart-updated', updateCart) }
    }, [refreshCart])

    const handleLogout = async () => {
        try {
            setLoader(true)
            setLogoutError('')
            await axiosInstance.post('/customers/logout')
            clearCart()
            navigate('/login')
        } catch (error) {
            setLogoutError(error.response?.data?.message || 'Could not log out. Please try again.')
        } finally {
            setLoader(false)
        }
    }

    const submitSearch = (event) => {
        event.preventDefault()
        const q = query.trim()
        setMenuOpen(false)
        setQuery('')
        navigate(q ? `/products?search=${encodeURIComponent(q)}` : '/products')
    }

    const searchForm = (idSuffix) => (
        <form onSubmit={submitSearch} role="search" className="relative w-full">
            <label htmlFor={`nav-search-${idSuffix}`} className="sr-only">Search products</label>
            <SearchIcon size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input id={`nav-search-${idSuffix}`} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products" className="input !rounded-full !bg-surface !py-2.5 !pl-10" />
        </form>
    )

    return (
        <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
                <Link to="/home" className="flex shrink-0 items-center gap-2 font-display text-xl font-extrabold tracking-tight text-brand">
                    <BrandMark />ShopKart
                </Link>
                <nav aria-label="Main" className="ml-4 hidden items-center gap-6 md:flex">
                    <NavLink to="/products" className={navLink}>Products</NavLink>
                    <NavLink to="/orders" className={navLink}>My orders</NavLink>
                </nav>
                <div className="ml-auto hidden w-full max-w-sm md:block">{searchForm('desktop')}</div>
                <div className="ml-auto flex items-center gap-1 md:ml-0">
                    <IconLink to="/wishlist" label="Wishlist" count={wishlistCount}><HeartIcon /></IconLink>
                    <IconLink to="/cart" label="Cart" count={itemCount}><BagIcon /></IconLink>
                    <button onClick={handleLogout} disabled={loader} className="btn btn-outline ml-2 hidden md:inline-flex"><LogoutIcon size={16} />{loader ? 'Logging out…' : 'Log out'}</button>
                    <button onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close menu' : 'Open menu'} className="rounded-md p-2.5 hover:bg-surface md:hidden">
                        {menuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>
            </div>
            {menuOpen && (
                <div className="space-y-4 border-t border-line bg-white px-4 py-4 md:hidden">
                    {searchForm('mobile')}
                    <nav aria-label="Mobile" className="flex flex-col gap-1 text-base font-semibold">
                        <Link to="/products" onClick={() => setMenuOpen(false)} className="rounded-md px-2 py-2.5 hover:bg-surface">Products</Link>
                        <Link to="/orders" onClick={() => setMenuOpen(false)} className="rounded-md px-2 py-2.5 hover:bg-surface">My orders</Link>
                    </nav>
                    <button onClick={handleLogout} disabled={loader} className="btn btn-outline w-full"><LogoutIcon size={16} />{loader ? 'Logging out…' : 'Log out'}</button>
                </div>
            )}
            {logoutError && <p role="alert" className="bg-coral-soft px-4 py-2 text-center text-sm text-coral">{logoutError}</p>}
        </header>
    )
}

export default Navbar
