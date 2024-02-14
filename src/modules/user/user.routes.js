const {Router} = require('express')
const authController = require('./auth.controller')

const router = Router()

router.get('/whoami', authController.checkOTP)

module.exports = {
    AuthRouter: router
}

