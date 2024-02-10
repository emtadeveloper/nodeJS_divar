class AuthController {
    async sendOTP(mobile) { }
    async checkOTP(mobile, code) { }
}

module.exports = new AuthController()

// singleton برای ارتباط با دیتابیس بهترین نوع ارتباط هستش