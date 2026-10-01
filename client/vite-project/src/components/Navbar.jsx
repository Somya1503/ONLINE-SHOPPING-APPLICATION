
import React, { useState } from 'react'
import { axiosInstance } from '../axiosCalls/axios'
import { useNavigate } from 'react-router-dom'


function Navbar() {

    const [loader, setLoader] = useState(false)

    const navigate = useNavigate()


    const handleLogout = async () => {

        try {

            setLoader(true)

            await axiosInstance.post('/customers/logout')

            console.log("Customer Logged OUT")

            navigate('/login')

        } catch (error) {

            console.log("Logout ERROR:", error)

        } finally {

            setLoader(false)

        }

    }


    return (

        <nav className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">

            <h1 className="text-xl font-semibold text-[#1A1A1A]">

                ShopKart

            </h1>


            <button

                onClick={handleLogout}

                disabled={loader}

                className="bg-[#1A1A1A] text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-[#FF4D6D] transition-colors disabled:opacity-50"

            >

                {loader ? "Logging out..." : "Logout"}

            </button>

        </nav>

    )

}


export default Navbar