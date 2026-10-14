import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { createPaymentOrder, verifyPayment } from '../services/api';

const money = value => Number(value || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
const initialAddress = { fullName: '', phone: '', addressLine1: '', city: '', state: '', pincode: '' };
const fields = [
    ['fullName','Full name','text'], ['phone','Phone number','tel'], ['addressLine1','Address line','text'],
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
                theme: { color: '#4338ca' },
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

    return <div className="min-h-screen bg-slate-50"><Navbar /><main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/cart" className="text-sm font-semibold text-indigo-700 hover:underline">← Back to cart</Link>
        <div className="mb-8 mt-4"><p className="text-sm font-bold uppercase tracking-widest text-indigo-700">SHOPKART</p><h1 className="mt-2 text-3xl font-black">Checkout</h1><p className="mt-2 text-slate-500">Add delivery details and pay securely in Razorpay Test Mode.</p></div>
        {!cartItems.length ? <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center"><p className="font-semibold">Your cart is empty or still loading.</p><Link to="/cart" className="mt-4 inline-block font-bold text-indigo-700">Return to cart</Link></div> :
        <form onSubmit={placeOrder} className="grid gap-6 lg:grid-cols-[1fr_340px]"><section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><h2 className="text-xl font-extrabold">Shipping Details</h2><div className="mt-6 grid gap-5 sm:grid-cols-2">{fields.map(([key,label,type]) => <label key={key} className={key === 'addressLine1' ? 'sm:col-span-2' : ''}><span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span><input type={type} autoComplete={key === 'fullName' ? 'name' : key === 'phone' ? 'tel' : 'off'} value={address[key]} onChange={e => {setAddress(prev => ({...prev,[key]:e.target.value})); setErrors(prev => ({...prev,[key]:''}));}} className={`w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-100 ${errors[key] ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-500'}`} />{errors[key] && <span className="mt-1 block text-xs text-rose-700">{errors[key]}</span>}</label>)}</div>
            {message && <p role="alert" className="mt-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{message}</p>}
            <p className="mt-5 text-xs text-slate-400">Test Mode only. Do not enter real card details into any custom ShopKart form.</p>
        </section><aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-extrabold">Order Summary</h2><div className="mt-5 space-y-4">{cartItems.map(item => <div key={item.product._id} className="flex justify-between gap-3 text-sm"><span className="text-slate-600">{item.product.name} × {item.quantity}</span><span className="whitespace-nowrap font-semibold">{money(item.product.price * item.quantity)}</span></div>)}</div><div className="my-5 border-t border-slate-200" /><div className="flex justify-between text-lg font-extrabold"><span>Total</span><span>{money(subtotal)}</span></div><button disabled={busy} type="submit" className="mt-6 w-full rounded-xl bg-indigo-700 px-5 py-3 font-bold text-white hover:bg-indigo-800 disabled:cursor-wait disabled:opacity-60">{busy ? 'Preparing payment…' : 'Place Order & Pay'}</button><p className="mt-3 text-center text-xs text-slate-400">Final price and stock are verified by the server.</p></aside></form>}
    </main></div>;
}
