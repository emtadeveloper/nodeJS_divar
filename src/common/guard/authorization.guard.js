const createHttpError =require( "http-errors");
const {AuhorizationtMessage} =require( "../messages/auh.message")
const UserModel =require( "../../modules/user/user.model")

const jwt = require('jsonwebtoken')

require('dotenv').config()

const Authorization = async (req, res, next) => {

    try {
        const token = req?.cookies?.access_token
        if (!token) throw new createHttpError(AuhorizationtMessage.Login)
        const data = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (typeof data === 'object' && "id" in data) {
            // lean   برای بالا بردن پرفورمنس در نود هستش که میاد و متد های اضافه رو جلوشون رو میگیره و صرفا مقادیری که داره رو بر میگردونه
            const user = await UserModel.findById(data?.id, {
                accessToken: 0,
                otp: 0,
                updateAt: 0,
                verifiedMobile: 0
            }).lean()
            if (!user) throw new createHttpError.UnAuthorized(AuhorizationtMessage.NotFoundAccount)
            req.user = user
            return next()
        }
        throw new createHttpError.UnAuthorized(AuhorizationtMessage.InvalidToken)
    } catch (err) {
        next(err)
    }
}

module.exports = Authorization