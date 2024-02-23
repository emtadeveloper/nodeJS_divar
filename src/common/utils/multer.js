const multer = require("multer")
const path = require("path");
const createHttpError = require("http-errors");
const {StatusCodes} = require("http-status-codes");
const {PostMessage} = require("../../modules/post/post.message");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        fs.mkdirSync(path.join(process.cwd(), "public", "upload"))
    },
    filename: function (req, file, cb) {
        const whiteListFormat = ["image/png", "image/jpg", "image/jpeg", "image/webp"]
        if (whiteListFormat.includes(file.mimeType)) {
            const format = path.extname(file.originalname)
            const filename = new Date().getTime().toString() + format
            cb(null, filename)
        } else {
            cb(new createHttpError(StatusCodes.BAD_REQUEST, PostMessage.WrongFormat))
        }
    }
})

const upload = multer({storage, limits: {fileSize: 3 * 1000 * 1000}})

module.exports = {
    upload
}