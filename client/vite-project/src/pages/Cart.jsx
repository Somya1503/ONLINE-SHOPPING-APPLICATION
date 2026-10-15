import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { EmptyState, ErrorState, PageHeader, PanelLoading } from '../components/States';
import { BagIcon, MinusIcon, PlusIcon, TrashIcon } from '../components/Icons';
import { useCart } from '../context/CartContext';
import { money, onImageError } from '../utils/format';

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

    return (
        <Layout>
            <PageHeader title="Your cart" subtitle={!loading && !error && cartItems.length > 0 ? `${itemCount} ${itemCount === 1 ? 'item' : 'items'}` : undefined}
                action={<Link to="/products" className="text-sm font-semibold text-brand hover:underline">Continue shopping</Link>} />
            {loading && cartItems.length === 0 ? <PanelLoading label="Loading your cart…" />
                : error ? <ErrorState message={error} onRetry={() => refreshCart().catch(() => {})} />
                : cartItems.length === 0 ? <EmptyState icon={<BagIcon size={26} />} title="Your cart is empty" text="Add a few products and they'll show up here." to="/products" cta="Browse products" />
                : (
                    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                        <section className="panel divide-y divide-line">
                            {cartItems.map(item => {
                                const id = item.product._id;
                                const rowBusy = busy === id;
                                return (
                                    <article key={id} className="flex gap-4 p-4 sm:gap-6 sm:p-6">
                                        <Link to={`/products/${id}`} className="shrink-0">
                                            <img src={item.product.image} alt={item.product.name} onError={onImageError} className="h-24 w-24 rounded-lg bg-brand-soft object-cover sm:h-32 sm:w-32" />
                                        </Link>
                                        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row">
                                            <div className="min-w-0">
                                                <Link to={`/products/${id}`} className="line-clamp-2 font-semibold hover:text-brand">{item.product.name}</Link>
                                                <p className="mt-1 text-sm text-muted">{money(item.product.price)} each</p>
                                                {item.quantity >= item.product.stock && <p className="mt-1 text-xs font-semibold text-[#7a4b00]">Maximum available quantity</p>}
                                                <button onClick={() => remove(id)} disabled={rowBusy} className="btn btn-danger-ghost -ml-3 mt-2 !px-3 !py-1.5"><TrashIcon size={15} />Remove</button>
                                            </div>
                                            <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-between">
                                                <div className="flex items-center rounded-md border border-line">
                                                    <button aria-label="Decrease quantity" disabled={rowBusy || item.quantity <= 1} onClick={() => change(item, item.quantity - 1)} className="flex h-9 w-9 items-center justify-center rounded-l-md hover:bg-surface disabled:opacity-30"><MinusIcon size={16} /></button>
                                                    <span className="w-9 text-center text-sm font-bold" aria-live="polite">{item.quantity}</span>
                                                    <button aria-label="Increase quantity" disabled={rowBusy || item.quantity >= item.product.stock} onClick={() => change(item, item.quantity + 1)} className="flex h-9 w-9 items-center justify-center rounded-r-md hover:bg-surface disabled:opacity-30"><PlusIcon size={16} /></button>
                                                </div>
                                                <p className="font-display text-lg font-bold">{money(item.product.price * item.quantity)}</p>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </section>
                        <aside className="panel h-fit p-6 lg:sticky lg:top-24">
                            <h2 className="text-xl font-extrabold">Order summary</h2>
                            <dl className="mt-5 space-y-3 text-sm">
                                <div className="flex justify-between"><dt className="text-muted">Items</dt><dd>{itemCount}</dd></div>
                                <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{money(subtotal)}</dd></div>
                            </dl>
                            <div className="my-5 border-t border-line" />
                            <div className="flex items-baseline justify-between"><span className="font-semibold">Total</span><span className="font-display text-2xl font-extrabold">{money(subtotal)}</span></div>
                            <p className="mt-2 text-xs text-muted">Shipping and final stock are confirmed at checkout.</p>
                            {actionError && <p role="alert" className="mt-4 rounded-md bg-coral-soft px-3.5 py-3 text-sm text-coral">{actionError}</p>}
                            <button onClick={() => navigate('/checkout')} className="btn btn-primary mt-6 w-full py-3.5 text-base">Proceed to checkout</button>
                        </aside>
                    </div>
                )}
        </Layout>
    );
}
