import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { EmptyState, ErrorState, PageHeader, PanelLoading } from '../components/States';
import { PackageIcon } from '../components/Icons';
import { fetchOrders } from '../services/api';
import { money, statusMeta } from '../utils/format';

export default function Orders() {
    const [orders, setOrders] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
    const [retry, setRetry] = useState(0);
    useEffect(() => {
        let active = true; setLoading(true); setError('');
        fetchOrders().then(data => { if (active) setOrders(data) }).catch(err => { if (active) setError(err.response?.data?.message || 'Unable to load your orders. Please log in and try again.') }).finally(() => { if (active) setLoading(false) });
        return () => { active = false };
    }, [retry]);

    return (
        <Layout width="max-w-4xl">
            <PageHeader title="My orders" subtitle="Everything you've bought from ShopKart." />
            {loading ? <PanelLoading label="Loading your orders…" />
                : error ? <ErrorState message={error} onRetry={() => setRetry(v => v + 1)} />
                : orders.length === 0 ? <EmptyState icon={<PackageIcon size={26} />} title="No orders yet" text="When you place an order it will appear here." to="/products" cta="Start shopping" />
                : (
                    <div className="space-y-4">
                        {orders.map(order => {
                            const meta = statusMeta[order.status] || { label: order.status.replaceAll('_', ' '), className: 'bg-surface text-ink' };
                            return (
                                <article key={order._id} className="panel p-5 sm:p-6">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <p className="font-display text-lg font-bold">Order #{order._id.slice(-8).toUpperCase()}</p>
                                            <p className="mt-0.5 text-sm text-muted">{new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                        </div>
                                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${meta.className}`}>{meta.label}</span>
                                    </div>
                                    <ul className="mt-4 flex gap-2 overflow-x-auto pb-1">
                                        {order.items.map((item, index) => (
                                            <li key={`${item.product}-${index}`} className="flex shrink-0 items-center gap-2 rounded-lg bg-surface py-1.5 pl-1.5 pr-3 text-sm">
                                                {item.image && <img src={item.image} alt="" className="h-9 w-9 rounded-md object-cover" />}
                                                <span className="max-w-[12rem] truncate">{item.name} × {item.quantity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
                                        <p><span className="text-sm text-muted">Total </span><span className="font-display text-lg font-bold">{money(order.totalAmount)}</span></p>
                                        <Link to={`/orders/${order._id}`} className="btn btn-outline">View details</Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
        </Layout>
    );
}
