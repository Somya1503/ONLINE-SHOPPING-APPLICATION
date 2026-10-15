import { Link } from 'react-router-dom'
import { BrandMark } from './Icons'

const Footer = () => (
    <footer className="mt-16 bg-brand-dark text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between lg:px-8">
            <div className="max-w-sm">
                <div className="flex items-center gap-2 font-display text-xl font-extrabold"><BrandMark size={28} />ShopKart</div>
                <p className="mt-3 text-sm leading-6 text-white/70">Electronics, fashion, books and home goods in one cart, with secure checkout through Razorpay.</p>
            </div>
            <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
                <Link to="/products" className="text-white/80 hover:text-white">Products</Link>
                <Link to="/cart" className="text-white/80 hover:text-white">Cart</Link>
                <Link to="/wishlist" className="text-white/80 hover:text-white">Wishlist</Link>
                <Link to="/orders" className="text-white/80 hover:text-white">My orders</Link>
            </nav>
        </div>
    </footer>
)

export default Footer
