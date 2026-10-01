
import Customer from "../models/customer.model.js"
import bcrypt from 'bcrypt'
import { genToken } from "../utils/generateToken.js"


// Cookie Options

const cookiesOptions = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
}


// REGISTER CUSTOMER

export const registerCustomer = async (req, res) => {

    try {

        const {
            fullName,
            email,
            password,
            phone
        } = req.body


        // All fields present

        if (!fullName || !email || !password || !phone) {

            return res.status(400).json({
                success: false,
                message: "All fields Required"
            })

        }


        // Password length

        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message: "Password Length should be greater than 6"
            })

        }


       

        const emailExists = await Customer.findOne({
            email: email.toLowerCase().trim()
        })

        if (emailExists) {

            return res.status(409).json({
                success: false,
                message: "Customer Already Exists"
            })

        }


        // Password Security

        const salt = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(
            password,
            salt
        )

        console.log("Password Hashed Successfully")


        // Create Customer

        const newCustomer = await Customer.create({

            fullName,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            phone

        })


       

        res.status(201).json({

            success: true,

            message: "Customer registered successfully",

            customer: {
                _id: newCustomer._id,
                fullName: newCustomer.fullName,
                email: newCustomer.email,
                phone: newCustomer.phone
            }

        })

    } catch (error) {

        console.log("ERROR:", error)

        if (error.code === 11000) {

            return res.status(409).json({
                success: false,
                message: "Customer Already Exists"
            })

        }

        res.status(500).json({

            success: false,
            message: "Internal Server Error"

        })

    }

}



// LOGIN CUSTOMER

export const loginCustomer = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body


        // All fields present
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            })

        }

        const customer = await Customer.findOne({
            email: email.toLowerCase().trim()
        })


        if (!customer) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const passwordCheck = await bcrypt.compare(
            password,
            customer.password
        )

        if (!passwordCheck) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const token = genToken(customer._id)

        // Store JWT inside cookie
        res.cookie(
            "token",
            token,
            cookiesOptions
        )

        // Login response
        res.status(200).json({
            success: true,
            message: "Login successful",
            customer: {
                _id: customer._id,
                fullName: customer.fullName,
                email: customer.email,
                phone: customer.phone
            }
        })
    } catch (error) {
        console.log("ERROR:", error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

// LOGOUT CUSTOMER
export const logoutCustomer = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/'
        })
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        })
    } catch (error) {
        console.log("ERROR:", error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}