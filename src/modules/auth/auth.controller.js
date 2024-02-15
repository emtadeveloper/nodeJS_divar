const {AuthMessage} = require('./auth.message')
const authService = require("./auth.service")
const NodeEnv = require('../../common/constant/env.enum')
const CookieNames = require('../../common/constant/cookie.enum')
const autoBind = require("auto-bind");

class AuthController {
    #service

    constructor() {
        autoBind(this)
        this.#service = authService
    }

    async sendOTP(req, res, next) {
        try {
            const {mobile} = req.body
            await this.#service.sendOTP(mobile)
            return res.json({message: AuthMessage.sendOtpSuccessfully})
        } catch (error) {
            next(error)
        }
    }

    async checkOTP(req, res, next) {
        try {
            const {mobile, code} = req.body
            const token = await this.#service.checkOTP(mobile, code)
            res.cookie(CookieNames.AccessToken, token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === NodeEnv.Production
            }).status(200).json({message: AuthMessage.loginSuccessfully, token})
        } catch (error) {
            next(error)
        }
    }

    async logout(req, res, next) {
        try {
            return res.clearCookie(CookieNames.AccessToken).status(200).json({message: AuthMessage.logoutSuccessfully})
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AuthController()