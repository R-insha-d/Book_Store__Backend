const jwt = require('jsonwebtoken')


const jwtMiddleware = (req, res, next) => {
    try {
        console.log("Request received at JWT Middleware")
        const token = req.headers.authorization?.split(' ')[1]
        const decode_value = jwt.verify(token, process.env.SECURITY_KEY)
        req.payload = decode_value.email
        next()
    }
    catch (err) {
        console.error( err)
        res.status(404).json( "Invalid token")
    }
}


module.exports = jwtMiddleware
