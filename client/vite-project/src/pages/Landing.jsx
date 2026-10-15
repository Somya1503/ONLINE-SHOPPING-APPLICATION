import { Link } from 'react-router-dom'
import { BrandMark } from '../components/Icons'
import { categoryList } from '../utils/categories'

const Landing = () => (
    <div className="flex min-h-screen flex-col">
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
            <span className="flex items-center gap-2 font-display text-xl font-extrabold text-brand"><BrandMark />ShopKart</span>
            <Link to="/login" className="btn btn-outline">Log in</Link>
        </header>
        <main className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-8">
            <div>
                <h1 className="font-display text-5xl font-extrabold leading-[1.02] sm:text-6xl lg:text-7xl">Shop for your desk, wardrobe, shelf and home.</h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-muted">Browse four categories, save what you like for later and pay securely with Razorpay. Track every order from your account.</p>
                <div className="mt-9 flex flex-wrap gap-3">
                    <Link to="/signup" className="btn btn-primary px-7 py-3.5 text-base">Create account</Link>
                    <Link to="/login" className="btn btn-outline px-7 py-3.5 text-base">Log in</Link>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4" aria-hidden="true">
                {categoryList.map(({ name, Icon, tile, glyph }, i) => (
                    <div key={name} style={{ animationDelay: `${i * 90}ms` }} className={`block-in flex aspect-square flex-col justify-between rounded-2xl p-5 sm:p-6 ${tile} ${i % 2 ? 'translate-y-6' : ''}`}>
                        <Icon size={36} className={glyph} />
                        <span className="font-display text-lg font-extrabold min-[420px]:text-xl sm:text-3xl">{name}</span>
                    </div>
                ))}
            </div>
        </main>
    </div>
)

export default Landing
