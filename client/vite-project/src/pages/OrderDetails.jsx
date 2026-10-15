import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { ErrorState, PanelLoading } from '../components/States';
import { ArrowLeftIcon, CheckIcon } from '../components/Icons';
import { fetchOrder } from '../services/api';
import { money, onImageError } from '../utils/format';

const steps = [['PLACED', 'Placed'], ['CONFIRMED', 'Confirmed'], ['SHIPPED', 'Shipped'], ['DELIVERED', 'Delivered']];

export default function OrderDetails() {
    const { id } = useParams(); const [order, setOrder] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
    useEffect(() => {
        let active = true; setLoading(true); setError('');
        fetchOrder(id).then(data => { if (active) setOrder(data) }).catch(err => { if (active) setError(err.response?.data?.message || 'Unable to load this order.') }).finally(() => { if (active) setLoading(false) });
        return () => { active = false };
    }, [id]);

    const current = order ? steps.findIndex(([key]) => key === order.status) : -1;
    const paid = order?.paymentStatus === 'PAID';

    return (
        <Layout width="max-w-4xl">
            <Link to="/orders" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"><ArrowLeftIcon size={16} />My orders</Link>
            {loading ? <PanelLoading label="Loading order…" />
                : error ? <ErrorState message={error} />
                : order && (
                    <>
                        <div className="mb-8 flex items-start gap-4">
                            {paid && <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white"><CheckIcon size={22} /></span>}
                            <div>
                                <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{paid ? 'Order placed' : 'Order details'}</h1>
                                <p className="mt-1 text-muted">Order #{order._id.slice(-8).toUpperCase()}{order.createdAt ? `, ${new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}` : ''}</p>
                            </div>
                        </div>

                        <section className="panel p-6 sm:p-8" aria-label="Order progress">
                            {current === -1 ? (
                                <p className="font-semibold">{order.status === 'PENDING_PAYMENT' ? 'Waiting for payment to complete.' : order.status.replaceAll('_', ' ')}</p>
                            ) : (
                                <ol className="grid grid-cols-4 gap-2">
                                    {steps.map(([key, label], i) => {
                                        const done = i <= current;
                                        return (
                                            <li key={key} className="relative text-center" aria-current={i === current ? 'step' : undefined}>
                                                {i > 0 && <span className={`absolute right-1/2 top-4 h-0.5 w-full -translate-y-1/2 ${i <= current ? 'bg-brand' : 'bg-line'}`} aria-hidden="true" />}
                                                <span className={`relative mx-auto flex h-8 w-8 items-center justify-center rounded-full border-2 ${done ? 'border-brand bg-brand text-white' : 'border-line bg-white text-transparent'}`}><CheckIcon size={16} /></span>
                                                <span className={`mt-2 block text-xs font-semibold sm:text-sm ${done ? 'text-ink' : 'text-muted'}`}>{label}</span>
                                            </li>
                                        );
                                    })}
                                </ol>
                            )}
                        </section>

                        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_280px]">
                            <section className="panel p-6 sm:p-8">
                                <h2 className="text-lg font-extrabold">Items</h2>
                                <ul className="mt-4 divide-y divide-line">
                                    {order.items.map((item, i) => (
                                        <li key={`${item.product}-${i}`} className="flex items-center gap-4 py-4 first:pt-0">
                                            <img src={item.image || undefined} alt="" onError={onImageError} className="h-16 w-16 shrink-0 rounded-lg bg-brand-soft object-cover" />
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold">{item.name}</p>
                                                <p className="text-sm text-muted">{money(item.price)} × {item.quantity}</p>
                                            </div>
                                            <p className="font-display font-bold">{money(item.price * item.quantity)}</p>
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex items-baseline justify-between border-t border-line pt-5">
                                    <span className="font-semibold">Total</span>
                                    <span className="font-display text-2xl font-extrabold">{money(order.totalAmount)}</span>
                                </div>
                            </section>
                            <aside className="space-y-6">
                                <section className="panel p-6">
                                    <h2 className="text-lg font-extrabold">Delivery address</h2>
                                    <address className="mt-3 text-sm not-italic leading-6 text-muted">
                                        <span className="font-semibold text-ink">{order.shippingAddress.fullName}</span><br />
                                        {order.shippingAddress.addressLine1}<br />
                                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}<br />
                                        {order.shippingAddress.phone}
                                    </address>
                                </section>
                                <section className="panel p-6">
                                    <h2 className="text-lg font-extrabold">Payment</h2>
                                    <p className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${paid ? 'bg-brand-soft text-brand' : 'bg-saffron-soft text-[#7a4b00]'}`}>{order.paymentStatus === 'PAID' ? 'Paid' : order.paymentStatus === 'FAILED' ? 'Failed' : 'Pending'}</p>
                                </section>
                            </aside>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link to="/orders" className="btn btn-primary">View all orders</Link>
                            <Link to="/products" className="btn btn-outline">Continue shopping</Link>
                        </div>
                    </>
                )}
        </Layout>
    );
}
