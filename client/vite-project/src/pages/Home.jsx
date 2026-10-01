import Navbar from '../components/Navbar'

const Home = () => {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <Navbar />

            <div className="flex items-center justify-center px-4 py-20">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-[#1A1A1A]">
                        Welcome to ShopKart
                    </h1>

                    <p className="text-sm text-gray-500 mt-3">
                        Login successful
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Home