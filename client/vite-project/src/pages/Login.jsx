import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios'

const Login = () => {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const [error, setError] = useState('')
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

        if (!formData.email || !formData.password) {
            setError('Please fill all the fields')
            return
        }

        try {
            setLoading(true)

            await axiosInstance.post(
                '/customers/login',
                formData
            )

            navigate('/home')
        } catch (error) {
            if (error.response?.status === 401) {
                setError('Invalid Credentials')
            } else {
                setError(
                    error.response?.data?.message ||
                    'Login failed'
                )
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-[380px]">
                <h1 className="text-2xl font-semibold text-[#1A1A1A] text-center">
                    Welcome Back
                </h1>

                <p className="text-sm text-gray-500 text-center mt-2">
                    Login to your ShopKart account
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white border border-gray-200 rounded-xl p-6 mt-6 space-y-4"
                >
                    {[
                        {
                            name: 'email',
                            type: 'email',
                            placeholder: 'Email'
                        },
                        {
                            name: 'password',
                            type: 'password',
                            placeholder: 'Password'
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white rounded-lg py-3 text-sm font-medium hover:bg-gray-800 disabled:bg-gray-400"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <p className="text-sm text-center text-gray-500">
                        Don't have an account?{' '}
                        <Link
                            to="/signup"
                            className="text-black font-medium hover:underline"
                        >
                            Register
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login