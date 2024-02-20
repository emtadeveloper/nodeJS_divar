const {Router} = require('express')
const PostController = require('./post.controller')


const router = Router()

router.get("/create", PostController.createPostPage)

module.exports = {
    PostRouter: router
}

