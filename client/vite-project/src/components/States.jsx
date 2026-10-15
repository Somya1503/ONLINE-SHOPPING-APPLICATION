import { Link } from 'react-router-dom'
import { AlertIcon } from './Icons'

export const PageHeader = ({ title, subtitle, action }) => (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
            <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{title}</h1>
            {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
        </div>
        {action}
    </div>
)

export const ErrorState = ({ message, onRetry }) => (
    <div role="alert" className="panel flex flex-col items-center px-6 py-14 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-coral-soft text-coral"><AlertIcon size={24} /></span>
        <h2 className="mt-4 text-xl font-bold">We couldn't load this</h2>
        <p className="mt-1 max-w-md text-muted">{message}</p>
        {onRetry && <button onClick={onRetry} className="btn btn-primary mt-5">Try again</button>}
    </div>
)

export const EmptyState = ({ icon, title, text, to, cta, action }) => (
    <div className="panel flex flex-col items-center border-dashed px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">{icon}</span>
        <h2 className="mt-5 text-2xl font-extrabold">{title}</h2>
        {text && <p className="mt-2 max-w-md text-muted">{text}</p>}
        {to && <Link to={to} className="btn btn-primary mt-6 px-6">{cta}</Link>}
        {action}
    </div>
)

export const ProductSkeletonGrid = ({ count = 8 }) => (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4" aria-busy="true" aria-label="Loading products">
        {Array.from({ length: count }, (_, i) => (
            <div key={i}>
                <div className="skeleton aspect-[4/3] rounded-xl" />
                <div className="skeleton mt-3 h-3 w-1/3 rounded" />
                <div className="skeleton mt-2 h-4 w-4/5 rounded" />
                <div className="skeleton mt-3 h-5 w-1/4 rounded" />
                <div className="skeleton mt-3 h-10 w-full rounded-md" />
            </div>
        ))}
    </div>
)

export const PanelLoading = ({ label }) => (
    <div className="panel flex items-center justify-center gap-3 px-6 py-16 text-muted" role="status">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-soft border-t-brand" />{label}
    </div>
)
