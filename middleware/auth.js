const jwt = require('jsonwebtoken')
const user = require('../models/user.model')

const auth = async (req, res, next) => {
    const token = req.cookies.token

    if(!token){
        return res.redirect('user/login')
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        req.user = decoded

        return next()

    } catch (error) {
        return res.redirect('user/login')
    }
}

module.exports = auth
