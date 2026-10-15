import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { ArrowLeftIcon, ShieldIcon } from '../components/Icons';
import { PageHeader } from '../components/States';
import { useCart } from '../context/CartContext';
import { createPaymentOrder, verifyPayment } from '../services/api';
import { money } from '../utils/format';

const initialAddress = { fullName: '', phone: '', addressLine1: '', city: '', state: '', pincode: '' };
const fields = [
    ['fullName','Full name','text'], ['phone','Phone number','tel'], ['addressLine1','Address','text'],
    ['city','City','text'], ['state','State','text'], ['pincode','Pincode','text']
];
const loadRazorpay = () => new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true); script.onerror = () => resolve(false);
    document.body.appendChild(script);
});

export default function Checkout() {
    const { cartItems, subtotal, refreshCart, clearCart } = useCart();
    const [address, setAddress] = useState(initialAddress);
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => { refreshCart().catch(() => {}); }, [refreshCart]);
    const validate = () => {
        const next = {};
        fields.forEach(([key, label]) => { if (!address[key].trim()) next[key] = `${label} is required.`; });
        if (address.phone.trim() && !/^[+\d][\d\s()-]{7,19}$/.test(address.phone.trim())) next.phone = 'Enter a valid phone number.';
        if (address.pincode.trim() && !/^\d{6}$/.test(address.pincode.trim())) next.pincode = 'Pincode must contain 6 digits.';
        setErrors(next); return Object.keys(next).length === 0;
    };

    const placeOrder = async event => {
        event.preventDefault(); setMessage('');
        if (!validate()) return;
        if (!cartItems.length) { setMessage('Your cart is empty. Add products before checkout.'); return; }
        setBusy(true);
        try {
            const ready = await loadRazorpay();
            if (!ready) throw new Error('Unable to load Razorpay Checkout. Check your internet connection and try again.');
            const data = await createPaymentOrder(address);
            const payment = new window.Razorpay({
                key: data.key, amount: data.amount, currency: data.currency, name: 'ShopKart',
                description: 'ShopKart Order', order_id: data.razorpayOrderId,
                prefill: { name: address.fullName, contact: address.phone },
                notes: { shopKartOrderId: data.shopKartOrderId },
                theme: { color: '#0f5c52' },
                handler: async response => {
                    try {
                        const verified = await verifyPayment({
                            shopKartOrderId: data.shopKartOrderId,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        clearCart();
                        navigate(`/order-success/${verified.order._id}`, { replace: true });
                    } catch (err) {
                        setMessage(err.response?.data?.message || 'Payment could not be verified. Your cart has not been cleared. Contact support before retrying payment.');
                        setBusy(false);
                    }
                },
                modal: { ondismiss: () => setBusy(false) }
            });
            payment.on('payment.failed', response => {
                setMessage(response.error?.description || 'Payment failed. Your cart has not been cleared. Please try again.');
                setBusy(false);
            });
            payment.open();
        } catch (err) {
            setMessage(err.response?.data?.message || err.message || 'Unable to start checkout.');
            setBusy(false);
        }
    };

    return (
        <Layout width="max-w-6xl">
            <Link to="/cart" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"><ArrowLeftIcon size={16} />Back to cart</Link>
            <PageHeader title="Checkout" subtitle="Add your delivery details, then pay securely with Razorpay." />
            {!cartItems.length ? (
                <div className="panel p-10 text-center">
                    <p className="font-semibold">Your cart is empty or still loading.</p>
                    <Link to="/cart" className="btn btn-primary mt-5">Return to cart</Link>
                </div>
            ) : (
                <form onSubmit={placeOrder} noValidate className="grid gap-8 lg:grid-cols-[1fr_360px]">
                    <section className="panel p-6 sm:p-8">
                        <h2 className="text-xl font-extrabold">Delivery details</h2>
                        <div className="mt-6 grid gap-5 sm:grid-cols-2">
                            {fields.map(([key, label, type]) => (
                                <div key={key} className={key === 'addressLine1' ? 'sm:col-span-2' : ''}>
                                    <label htmlFor={`ship-${key}`} className="label">{label}</label>
                                    <input id={`ship-${key}`} type={type} inputMode={key === 'pincode' ? 'numeric' : undefined} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `ship-${key}-error` : undefined}
                                        autoComplete={{ fullName: 'name', phone: 'tel', addressLine1: 'address-line1', city: 'address-level2', state: 'address-level1', pincode: 'postal-code' }[key]}
                                        value={address[key]} onChange={e => { setAddress(prev => ({ ...prev, [key]: e.target.value })); setErrors(prev => ({ ...prev, [key]: '' })); }}
                                        className={`input ${errors[key] ? '!border-coral' : ''}`} />
                                    {errors[key] && <p id={`ship-${key}-error`} className="mt-1.5 text-xs font-medium text-coral">{errors[key]}</p>}
                                </div>
                            ))}
                        </div>
                        {message && <p role="alert" className="mt-6 rounded-md bg-coral-soft px-4 py-3 text-sm text-coral">{message}</p>}
                    </section>
                    <aside className="panel h-fit p-6 lg:sticky lg:top-24">
                        <h2 className="text-xl font-extrabold">Order summary</h2>
                        <ul className="mt-5 space-y-3 text-sm">
                            {cartItems.map(item => (
                                <li key={item.product._id} className="flex justify-between gap-3">
                                    <span className="text-muted">{item.product.name} × {item.quantity}</span>
                                    <span className="whitespace-nowrap font-semibold">{money(item.product.price * item.quantity)}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="my-5 border-t border-line" />
                        <div className="flex items-baseline justify-between"><span className="font-semibold">Total</span><span className="font-display text-2xl font-extrabold">{money(subtotal)}</span></div>
                        <button disabled={busy} type="submit" className="btn btn-primary mt-6 w-full py-3.5 text-base">{busy ? 'Preparing payment…' : 'Place order and pay'}</button>
                        <p className="mt-4 flex items-start gap-2 text-xs text-muted"><ShieldIcon size={16} className="mt-px shrink-0 text-brand" />Payment happens in Razorpay's window. The server verifies the final price and stock.</p>
                    </aside>
                </form>
            )}
        </Layout>
    );
}
