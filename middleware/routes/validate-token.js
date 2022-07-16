const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const token = req.header('auth-token')
    if (!token) return res.status(401).json({ error: 'Acceso denegado' })
    try {
        const verified = jwt.verify(token,"supersecreto")
        req.user = verified
        next() // continuamos
    } catch (error) {
        res.status(402).json({error: 'token no es válido'})
    }
}

module.exports = verifyToken;
