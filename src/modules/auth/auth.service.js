const autoBind = require('auto-bind')
const UserModel = require('../user/user.model')
const createHttpError  = require("http-errors");
const { AuthMessage } = require('./auth.message')
const { randomInt } = require("crypto");
const jwt = require('jsonwebtoken');
const StatusCode = require('../../common/constant/statusCode.enum')
class AuthService {
    #model

    constructor() {
        autoBind(this)
        this.#model = UserModel
    }

    async sendOTP(mobile) {
        const user = await this.#model.findOne({mobile})
        const now = new Date().getTime()
        const otp = {
            code: randomInt(10000, 99999),
            expiresIn: now + (1000 * 60 * 2)
        }
        if (!user) {
            return await this.#model.create({ mobile, otp })
        }
        if (user.otp && user.otp.expiresIn > now) {
            throw new createHttpError(StatusCode.BadRequest,AuthMessage.OtpCodeNotExpired)
        }
        await user.save()
        return user
    }

    async checkOTP(mobile, code) {
        const user = await this.checkExistByMobile(mobile)
        const now = new Date().getDate()
        if (user?.otp?.expiresIn < now) throw new createHttpError(StatusCode.Unauthorized,AuthMessage.OtpCodeExpired);
        if (user?.otp?.code !== code) throw new createHttpError(StatusCode.Unauthorized,AuthMessage.OtpCodeIsIncorrect);
        if (!user.verifiedMobile) {
            user.verifiedMobile = true
        }
        const accessToken = this.signToken({ mobile, id: user._id })
        user.accessToken = accessToken
        await user.save()
        return accessToken
    }



    signToken(payload) {
        // 1000*60*60*24*365 = 1y
        return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1y' })
    }

    async checkExistByMobile(mobile) {
        const user = await this.#model.findOne({mobile})
        if (!user) throw new createHttpError(StatusCode.NotFound,AuthMessage.NotFound)
        return user
    }

}

module.exports = new AuthService()

