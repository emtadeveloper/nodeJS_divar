const {Router} = require('express')
const PostController = require('./post.controller')
const {upload} = require("../../common/utils/multer");


const router = Router()

router.get("/create", PostController.createPostPage)
router.post("/create",upload.array('images',10), PostController.createPostPage)

// Method Delete  در درخواست های html css کار نمیکنه به جاش از متد get استفاده میکنیم

router.get("/my",upload.array('images',10), PostController.findMyPosts)

module.exports = {
    PostRouter: router
}

