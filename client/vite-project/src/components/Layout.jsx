import Navbar from './Navbar'
import Footer from './Footer'

const Layout = ({ children, width = 'max-w-7xl' }) => (
    <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className={`mx-auto w-full flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 ${width}`}>{children}</main>
        <Footer />
    </div>
)

export default Layout
