const createOrder = async ({ amount, currency = 'INR', receipt }) => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error('Razorpay Test Mode keys are missing. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to server/.env.');
    }
    const credentials = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: { Authorization: `Basic ${credentials}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency, receipt })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.description || 'Razorpay could not create the payment order.');
    return data;
};
export const getRazorpay = () => ({ orders: { create: createOrder } });
