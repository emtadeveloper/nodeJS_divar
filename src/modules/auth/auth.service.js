const autoBind = require('auto-bind')
const UserModel = require('../user/user.model')
const {BadRequest, NOTFOUND} = require("http-errors");
const {AuthMessage} = require('./auth.message')
const {randomInt} = require("crypto");

class AuthService {
    #model

    constructor() {
        autoBind(this)
        this.#model = UserModel
    }

    async sendOTP(mobile) {
        const user = await this.#model.findOne({mobile})
        const now = new Date().getTime()
        user.otp = {
            code: randomInt(10000, 99999),
            expiresIn: now + (1000 * 60 * 2)
        }
        if (!user) {
            return await this.#model.create({mobile, otp: user.otp})
        }
        if (user.otp && user.otp.expiresIn > now) {
            throw new BadRequest(AuthMessage.OtpCodeNotExpired)
        }
        await user.save()
        return user
    }

    async checkExistByMobile(mobile) {
        const user = await this.#model.findOne({mobile})
        if (!user) throw new NOTFOUND(AuthMessage.NotFound)
        return user
    }

    async checkOTP(mobile, code) {
    }
}

module.exports = new AuthService()

