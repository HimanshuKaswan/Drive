const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register',
    body('username').trim().isLength({ min: 3 }),
    body('email').trim().isEmail().isLength({ min: 13 }),
    body('password').trim().isLength({ min: 5 }),
    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                errors: errors.array(),
                message: 'Invalid data'
            })
        }

        const { username, email, password } = req.body

        const user = await userModel.findOne({ username: username })

        if (user) {
            return res.status(400).json({
                message: 'Username already exists'
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const  newUser = await userModel.create({
            username,
            email,
            password: hashPassword
        })

        const token = await newUser.generateJWT()


        console.log(token)
        res.cookie('token', token)
        res.redirect('/home')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login',
    body('username').trim().isLength({ min: 3 }),
    body('password').trim().isLength({ min: 5 }),
    async (req, res) => {
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Invalid data'
            })
        }

        const { username, password } = req.body
        const user = await userModel.findOne({ username: username }).select('+password')

        if (!user) {
            return res.status(400).json({
                message: 'Username or password is incorrect'
            })
        }

        const isMatch = await user.comparePassword(password)

        if (!isMatch) {
            return res.status(400).json({
                message: 'Username or password is incorrect'
            })
        }

        const token = await user.generateJWT()


        console.log(token)
        res.cookie('token', token)
        res.redirect('/home')
    }
)

module.exports = router