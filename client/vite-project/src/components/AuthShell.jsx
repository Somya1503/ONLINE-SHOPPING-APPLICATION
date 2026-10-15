import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BrandMark } from './Icons'
import { categoryList } from '../utils/categories'

export const Field = ({ id, label, type = 'text', value, onChange, name, autoComplete, hint }) => {
    const [visible, setVisible] = useState(false)
    const isPassword = type === 'password'
    return (
        <div>
            <label htmlFor={id} className="label">{label}</label>
            <div className="relative">
                <input id={id} name={name} type={isPassword && visible ? 'text' : type} value={value} onChange={onChange} autoComplete={autoComplete} className={`input ${isPassword ? 'pr-16' : ''}`} />
                {isPassword && (
                    <button type="button" onClick={() => setVisible((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-semibold text-brand hover:bg-brand-soft" aria-label={visible ? 'Hide password' : 'Show password'}>
                        {visible ? 'Hide' : 'Show'}
                    </button>
                )}
            </div>
            {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
        </div>
    )
}

const AuthShell = ({ title, subtitle, children, footer }) => (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <aside className="relative hidden flex-col justify-between bg-brand-dark p-12 text-white lg:flex">
            <Link to="/" className="flex items-center gap-2 font-display text-2xl font-extrabold"><BrandMark size={34} />ShopKart</Link>
            <div>
                <p className="max-w-md font-display text-4xl font-extrabold leading-tight">Your cart, wishlist and orders in one place.</p>
                <div className="mt-10 grid max-w-md grid-cols-2 gap-3">
                    {categoryList.map(({ name, Icon, tile, glyph }) => (
                        <div key={name} className={`flex h-28 flex-col justify-between rounded-xl p-4 ${tile}`}>
                            <Icon size={26} className={glyph} />
                            <span className="font-display text-lg font-bold">{name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <p className="text-sm text-white/60">Secure checkout with Razorpay.</p>
        </aside>
        <main className="flex items-center justify-center px-4 py-12 sm:px-8">
            <div className="w-full max-w-md">
                <Link to="/" className="mb-8 flex items-center gap-2 font-display text-xl font-extrabold text-brand lg:hidden"><BrandMark />ShopKart</Link>
                <h1 className="font-display text-3xl font-extrabold">{title}</h1>
                <p className="mt-2 text-muted">{subtitle}</p>
                {children}
                <p className="mt-6 text-center text-sm text-muted">{footer}</p>
            </div>
        </main>
    </div>
)

export default AuthShell
