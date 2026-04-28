const jwt = require('jsonwebtoken')


const adminJwtMiddleware = (req, res, next) => {
    try {
        console.log("Request received at JWT Middleware")
        const token = req.headers.authorization?.split(' ')[1]
        const decode_value = jwt.verify(token, process.env.SECURITY_KEY)
        console.log(decode_value)
        req.payload = decode_value.email
        req.role = decode_value.role
        if (decode_value.role !== "admin") {
            res.status(406).json("Unauthorized Access,user is not an admin")
        }
        else {
            next()
        }
    }
    catch (err) {
        console.error(err)
        res.status(404).json("Invalid token")
    }
}


module.exports = adminJwtMiddleware
