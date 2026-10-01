import { Link } from 'react-router-dom'

const ProductCard = ({ product }) => {
    const inStock = Number(product.stock) > 0
    return (
        <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <Link to={`/products/${product._id}`} className="block overflow-hidden bg-slate-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
                    onError={(event) => { event.currentTarget.src = 'https://placehold.co/600x400/f1f5f9/64748b?text=ShopKart+Product' }}
                />
            </Link>
            <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{product.category}</span>
                    <span className={`text-xs font-semibold ${inStock ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {inStock ? `${product.stock} units left` : 'Out of stock'}
                    </span>
                </div>
                <h2 className="line-clamp-2 min-h-12 text-lg font-bold text-slate-900">{product.name}</h2>
                <p className="text-xl font-extrabold text-slate-900">{Number(product.price).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })}</p>
                <Link to={`/products/${product._id}`} className="block rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-indigo-700">
                    View Details
                </Link>
            </div>
        </article>
    )
}

export default ProductCard
