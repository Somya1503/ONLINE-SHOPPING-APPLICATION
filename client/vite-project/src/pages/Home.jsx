import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import { PackageIcon, ShieldIcon, HeartIcon } from '../components/Icons'
import { fetchProducts, fetchWishlist } from '../services/api'
import { categoryList } from '../utils/categories'

const perks = [
    { Icon: ShieldIcon, text: 'Secure checkout with Razorpay' },
    { Icon: PackageIcon, text: 'Track every order from your account' },
    { Icon: HeartIcon, text: 'Save products to your wishlist for later' }
]

const Home = () => {
    const [latest, setLatest] = useState([])
    const [savedIds, setSavedIds] = useState(() => new Set())

    useEffect(() => {
        let active = true
        fetchProducts({ sort: 'newest' }).then((items) => { if (active) setLatest(items.slice(0, 4)) }).catch(() => {})
        fetchWishlist().then((items) => { if (active) setSavedIds(new Set(items.map((p) => p._id))) }).catch(() => {})
        return () => { active = false }
    }, [])

    return (
        <Layout>
            <section className="pt-2 sm:pt-6">
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                    <h1 className="max-w-4xl font-display text-4xl font-extrabold leading-[1.03] sm:text-5xl lg:text-7xl">Everything for your desk, wardrobe, shelf and home.</h1>
                    <Link to="/products" className="btn btn-accent shrink-0 self-start px-7 py-3.5 text-base lg:self-auto">Browse all products</Link>
                </div>
                <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    {categoryList.map(({ name, Icon, tile, glyph }, i) => (
                        <Link key={name} to={`/products?category=${name}`} style={{ animationDelay: `${i * 90}ms` }} className={`block-in group flex min-h-[170px] flex-col justify-between rounded-2xl p-5 transition-[filter] hover:brightness-95 sm:min-h-[260px] sm:p-6 lg:min-h-[320px] ${tile}`}>
                            <Icon size={40} className={glyph} />
                            <span className="font-display text-xl font-extrabold min-[420px]:text-2xl sm:text-4xl">{name}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {latest.length > 0 && (
                <section className="mt-16">
                    <div className="mb-6 flex items-end justify-between gap-4">
                        <h2 className="font-display text-2xl font-extrabold sm:text-3xl">New arrivals</h2>
                        <Link to="/products" className="text-sm font-semibold text-brand hover:underline">See all products</Link>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
                        {latest.map((product) => <ProductCard key={product._id} product={product} initialSaved={savedIds.has(product._id)} />)}
                    </div>
                </section>
            )}

            <section className="mt-16 grid gap-3 sm:grid-cols-3">
                {perks.map(({ Icon, text }) => (
                    <div key={text} className="flex items-center gap-3 rounded-xl bg-white px-5 py-4 border border-line">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand"><Icon size={20} /></span>
                        <p className="text-sm font-semibold leading-snug">{text}</p>
                    </div>
                ))}
            </section>
        </Layout>
    )
}

export default Home
