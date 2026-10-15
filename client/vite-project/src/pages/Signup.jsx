import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios'
import AuthShell, { Field } from '../components/AuthShell'

const Signup = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', phone: '' })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        if (!formData.fullName || !formData.email || !formData.password || !formData.phone) {
            setError('Fill in all the fields.')
            return
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.')
            return
        }
        try {
            setLoading(true)
            const response = await axiosInstance.post('/customers/register', formData)
            setSuccess(response.data.message)
            setFormData({ fullName: '', email: '', password: '', phone: '' })
            setTimeout(() => { navigate('/login') }, 1000)
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthShell title="Create your account" subtitle="It takes under a minute." footer={<>Already have an account? <Link to="/login" className="font-semibold text-brand hover:underline">Log in</Link></>}>
            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
                <Field id="fullName" name="fullName" label="Full name" autoComplete="name" value={formData.fullName} onChange={handleChange} />
                <Field id="email" name="email" label="Email" type="email" autoComplete="email" value={formData.email} onChange={handleChange} />
                <Field id="phone" name="phone" label="Phone number" type="tel" autoComplete="tel" value={formData.phone} onChange={handleChange} />
                <Field id="password" name="password" label="Password" type="password" autoComplete="new-password" hint="At least 6 characters." value={formData.password} onChange={handleChange} />
                {error && <p role="alert" className="rounded-md bg-coral-soft px-3.5 py-3 text-sm text-coral">{error}</p>}
                {success && <p role="status" className="rounded-md bg-brand-soft px-3.5 py-3 text-sm text-brand">{success}</p>}
                <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">{loading ? 'Creating account…' : 'Create account'}</button>
            </form>
        </AuthShell>
    )
}

export default Signup
