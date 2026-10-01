import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios'
import { fetchWishlist } from '../services/api'

function Navbar() {
    const [loader, setLoader] = useState(false)
    const [wishlistCount, setWishlistCount] = useState(0)
    const [logoutError, setLogoutError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        let active = true
        fetchWishlist().then((items) => { if (active) setWishlistCount(items.length) }).catch(() => {})
        const updateCount = (event) => {
            if (typeof event.detail?.count === 'number') setWishlistCount(event.detail.count)
            else fetchWishlist().then((items) => setWishlistCount(items.length)).catch(() => {})
        }
        window.addEventListener('wishlist-updated', updateCount)
        return () => { active = false; window.removeEventListener('wishlist-updated', updateCount) }
    }, [])

    const handleLogout = async () => {
        try {
            setLoader(true)
            setLogoutError('')
            await axiosInstance.post('/customers/logout')
            navigate('/login')
        } catch (error) {
            setLogoutError(error.response?.data?.message || 'Could not log out. Please try again.')
        } finally {
            setLoader(false)
        }
    }

    return (
        <nav className="sticky top-0 z-20 flex w-full flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
            <Link to="/home" className="text-xl font-black tracking-tight text-slate-900">Shop<span className="text-indigo-700">Kart</span></Link>
            <div className="flex flex-wrap items-center gap-2 sm:gap-5">
                <Link to="/home" className="text-sm font-semibold text-slate-600 hover:text-indigo-700">Home</Link>
                <Link to="/products" className="text-sm font-semibold text-slate-600 hover:text-indigo-700">Products</Link>
                <Link to="/wishlist" className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700 hover:bg-rose-100">Wishlist <span>({wishlistCount})</span></Link>
                <button onClick={handleLogout} disabled={loader} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-50">{loader ? 'Logging out…' : 'Logout'}</button>
            </div>
            {logoutError && <p role="alert" className="w-full text-right text-xs text-rose-700">{logoutError}</p>}
        </nav>
    )
}

export default Navbar
