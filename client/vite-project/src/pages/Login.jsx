import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios'
import AuthShell, { Field } from '../components/AuthShell'

const Login = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (!formData.email || !formData.password) {
            setError('Enter your email and password.')
            return
        }
        try {
            setLoading(true)
            await axiosInstance.post('/customers/login', formData)
            navigate('/home')
        } catch (error) {
            if (error.response?.status === 401) setError('Email or password is incorrect.')
            else setError(error.response?.data?.message || 'Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthShell title="Log in" subtitle="Welcome back. Pick up where you left off." footer={<>New to ShopKart? <Link to="/signup" className="font-semibold text-brand hover:underline">Create an account</Link></>}>
            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
                <Field id="email" name="email" label="Email" type="email" autoComplete="email" value={formData.email} onChange={handleChange} />
                <Field id="password" name="password" label="Password" type="password" autoComplete="current-password" value={formData.password} onChange={handleChange} />
                {error && <p role="alert" className="rounded-md bg-coral-soft px-3.5 py-3 text-sm text-coral">{error}</p>}
                <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">{loading ? 'Logging in…' : 'Log in'}</button>
            </form>
        </AuthShell>
    )
}

export default Login
