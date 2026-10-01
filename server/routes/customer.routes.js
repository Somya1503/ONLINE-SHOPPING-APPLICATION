import express from 'express'
import {
    registerCustomer,
    loginCustomer,
    logoutCustomer
} from '../controllers/customer.controller.js'
import {
    isAuthenticated
} from '../middlewares/authMiddleware.js'

const customerRoutes = express.Router()

// register
customerRoutes.post(
    '/register',
    registerCustomer
)
// login
customerRoutes.post(
    '/login',
    loginCustomer
)
//logout
customerRoutes.post(
    '/logout',
    isAuthenticated,
    logoutCustomer
)
export default customerRoutes