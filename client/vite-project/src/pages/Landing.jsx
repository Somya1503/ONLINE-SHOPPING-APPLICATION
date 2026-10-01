import { Link } from 'react-router-dom'

const Landing = () => {
    return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-[380px] text-center">
                <h1 className="text-3xl font-semibold text-[#1A1A1A]">
                    Welcome to ShopKart
                </h1>

                <p className="text-sm text-gray-500 mt-3">
                    Your simple shopping platform
                </p>

                <div className="mt-8 space-y-3">
                    <Link
                        to="/login"
                        className="block w-full bg-black text-white rounded-lg py-3 text-sm font-medium hover:bg-gray-800"
                    >
                        Login
                    </Link>

                    <Link
                        to="/signup"
                        className="block w-full border border-gray-300 bg-white text-black rounded-lg py-3 text-sm font-medium hover:bg-gray-100"
                    >
                        Register
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Landing