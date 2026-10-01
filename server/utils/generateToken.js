import jwt from 'jsonwebtoken'
export const genToken = (customerId) => {
    const token = jwt.sign(
        {
            customerId: customerId
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1d'
        }
    )
    return token
}