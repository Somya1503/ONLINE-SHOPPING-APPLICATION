import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios'

const Signup = () => {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: ''
    })

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError('')
        setSuccess('')

        if (
            !formData.fullName ||
            !formData.email ||
            !formData.password ||
            !formData.phone
        ) {
            setError('Please fill all the fields')
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        try {
            setLoading(true)

            const response = await axiosInstance.post(
                '/customers/register',
                formData
            )

            setSuccess(response.data.message)

            setFormData({
                fullName: '',
                email: '',
                password: '',
                phone: ''
            })

            setTimeout(() => {
                navigate('/login')
            }, 1000)
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Registration failed'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-[380px]">
                <h1 className="text-2xl font-semibold text-[#1A1A1A] text-center">
                    Create Account
                </h1>

                <p className="text-sm text-gray-500 text-center mt-2">
                    Register your ShopKart account
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white border border-gray-200 rounded-xl p-6 mt-6 space-y-4"
                >
                    {[
                        {
                            name: 'fullName',
                            type: 'text',
                            placeholder: 'Full Name'
                        },
                        {
                            name: 'email',
                            type: 'email',
                            placeholder: 'Email'
                        },
                        {
                            name: 'password',
                            type: 'password',
                            placeholder: 'Password'
                        },
                        {
                            name: 'phone',
                            type: 'text',
                            placeholder: 'Phone Number'
                        }
                    ].map((field) => (
                        <input
                            key={field.name}
                            type={field.type}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={formData[field.name]}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm outline-none focus:border-black"
                        />
                    ))}

                    {error && (
                        <p className="text-sm text-red-500">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="text-sm text-green-600">
                            {success}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white rounded-lg py-3 text-sm font-medium hover:bg-gray-800 disabled:bg-gray-400"
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>

                    <p className="text-sm text-center text-gray-500">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-black font-medium hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Signup