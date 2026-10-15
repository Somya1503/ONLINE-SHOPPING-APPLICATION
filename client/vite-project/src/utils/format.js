export const money = (value, maximumFractionDigits = 2) =>
    Number(value || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits })

// Inline SVG fallback so broken product images never hit an external placeholder service.
export const fallbackImage =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#e3efec"/><g fill="none" stroke="#0f5c52" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity=".55"><path d="M165 125h70l-7 55a8 8 0 0 1-8 7h-40a8 8 0 0 1-8-7z"/><path d="M180 125v-6a20 20 0 0 1 40 0v6"/></g></svg>`
    )

export const onImageError = (event) => {
    event.currentTarget.onerror = null
    event.currentTarget.src = fallbackImage
}

export const statusMeta = {
    PENDING_PAYMENT: { label: 'Payment pending', className: 'bg-saffron-soft text-[#7a4b00]' },
    PLACED: { label: 'Placed', className: 'bg-brand-soft text-brand' },
    CONFIRMED: { label: 'Confirmed', className: 'bg-brand-soft text-brand' },
    SHIPPED: { label: 'Shipped', className: 'bg-saffron-soft text-[#7a4b00]' },
    DELIVERED: { label: 'Delivered', className: 'bg-brand text-white' }
}
