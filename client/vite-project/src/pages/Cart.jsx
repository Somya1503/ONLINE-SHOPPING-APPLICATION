import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

const money = value => Number(value || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });

export default function Cart() {
    const { cartItems, loading, error, refreshCart, updateQuantity, removeFromCart, itemCount, subtotal } = useCart();
    const [busy, setBusy] = useState('');
    const [actionError, setActionError] = useState('');
    const navigate = useNavigate();
    useEffect(() => { refreshCart().catch(() => {}); }, [refreshCart]);
    const change = async (item, quantity) => {
        if (quantity < 1) return;
        setBusy(item.product._id); setActionError('');
        try { await updateQuantity(item.product._id, quantity); }
        catch (err) { setActionError(err.response?.data?.message || 'Could not update quantity.'); }
        finally { setBusy(''); }
    };
    const remove = async id => {
        setBusy(id); setActionError('');
        try { await removeFromCart(id); }
        catch (err) { setActionError(err.response?.data?.message || 'Could not remove item.'); }
        finally { setBusy(''); }
    };
    return <div className="min-h-screen bg-slate-50"><Navbar /><main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-widest text-indigo-700">SHOPKART</p><h1 className="mt-2 text-3xl font-black text-slate-900">My Cart</h1></div><Link to="/products" className="font-semibold text-indigo-700 hover:underline">Continue shopping →</Link></div>
        {loading ? <div className="rounded-2xl bg-white p-12 text-center font-semibold">Loading your cart...</div>
        : error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center"><p className="font-semibold text-rose-800">{error}</p><button onClick={() => refreshCart().catch(() => {})} className="mt-4 rounded-xl bg-rose-700 px-5 py-2 font-semibold text-white">Try Again</button></div>
        : cartItems.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><div className="text-5xl">🛒</div><h2 className="mt-4 text-xl font-bold">Your cart is empty</h2><p className="mt-2 text-slate-500">Looks like you haven't added anything yet.</p><Link to="/products" className="mt-6 inline-block rounded-xl bg-indigo-700 px-6 py-3 font-bold text-white">Browse Products</Link></div>
        : <div className="grid gap-6 lg:grid-cols-[1fr_340px]"><section className="space-y-4">{cartItems.map(item => <article key={item.product._id} className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:p-6">
            <img src={item.product.image} alt={item.product.name} onError={e => {e.currentTarget.src='https://placehold.co/240x200?text=Product'}} className="h-32 w-full rounded-xl bg-slate-100 object-cover sm:w-36" />
            <div className="min-w-0 flex-1"><Link to={`/products/${item.product._id}`} className="text-lg font-bold text-slate-900 hover:text-indigo-700">{item.product.name}</Link><p className="mt-2 text-slate-500">{money(item.product.price)} each</p><p className="mt-1 text-xs text-slate-400">{item.product.stock} available</p><button onClick={() => remove(item.product._id)} disabled={busy === item.product._id} className="mt-3 text-sm font-semibold text-rose-600 hover:underline disabled:opacity-50">Remove</button></div>
            <div className="flex items-center justify-between gap-5 sm:flex-col sm:items-end"><div className="flex items-center gap-3 rounded-xl border border-slate-200 p-1"><button aria-label="Decrease quantity" disabled={busy === item.product._id || item.quantity <= 1} onClick={() => change(item, item.quantity - 1)} className="h-8 w-8 rounded-lg font-bold hover:bg-slate-100 disabled:opacity-30">−</button><span className="min-w-5 text-center font-bold">{item.quantity}</span><button aria-label="Increase quantity" disabled={busy === item.product._id || item.quantity >= item.product.stock} onClick={() => change(item, item.quantity + 1)} className="h-8 w-8 rounded-lg font-bold hover:bg-slate-100 disabled:opacity-30">+</button></div><p className="text-lg font-extrabold">{money(item.product.price * item.quantity)}</p></div>
        </article>)}</section><aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-extrabold">Order Summary</h2><div className="mt-5 flex justify-between text-sm text-slate-600"><span>Total units</span><span>{itemCount}</span></div><div className="mt-3 flex justify-between text-sm text-slate-600"><span>Subtotal</span><span>{money(subtotal)}</span></div><div className="my-5 border-t border-slate-200" /><div className="flex justify-between text-lg font-extrabold"><span>Total</span><span>{money(subtotal)}</span></div><p className="mt-2 text-xs text-slate-400">Shipping and final stock are confirmed at checkout.</p>{actionError && <p role="alert" className="mt-4 text-sm text-rose-700">{actionError}</p>}<button onClick={() => navigate('/checkout')} className="mt-6 w-full rounded-xl bg-indigo-700 px-5 py-3 font-bold text-white hover:bg-indigo-800">Proceed to Checkout</button></aside></div>}
    </main></div>;
}
