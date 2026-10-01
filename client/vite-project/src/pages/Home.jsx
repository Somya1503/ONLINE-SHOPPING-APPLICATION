import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Home = () => (
    <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-700 px-7 py-14 text-white sm:px-12 sm:py-20">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-200">Welcome to ShopKart</p>
                <h1 className="mt-4 max-w-2xl text-4xl font-black tracking-tight sm:text-6xl">Your next favourite is waiting.</h1>
                <p className="mt-5 max-w-xl leading-7 text-indigo-100">Explore our product catalogue, search by name, and filter by category to find what you need.</p>
                <Link to="/products" className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 font-bold text-indigo-950 transition hover:bg-indigo-100">Explore Products →</Link>
            </section>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[['01', 'Browse', 'Explore products from the live catalogue.'], ['02', 'Discover', 'Search by name and filter by category.'], ['03', 'Learn more', 'Open any product to view its full details.']].map(([number, title, description]) => (
                    <div key={number} className="rounded-2xl border border-slate-200 bg-white p-6">
                        <p className="text-sm font-black text-indigo-600">{number}</p>
                        <h2 className="mt-3 text-lg font-bold text-slate-900">{title}</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
                    </div>
                ))}
            </div>
        </main>
    </div>
)

export default Home
