const autoBind = require("auto-bind");
const CategoryModel = require("../category/category.model")
const PostService = require("./post.service");
const {PostMessage} = require("./post.message");
const {StatusCodes} = require('http-status-codes')

class PostController {
    #service;

    constructor() {
        autoBind(this)
        this.#service = PostService
    }

    async createPostPage(req, res, next) {
        try {
            const {slug} = req.query
            let match = { parent:null}
            let categories =[]
            const categories = await CategoryModel.aggregate([{$match: {parent: null}}])
            console.log(categories)
            res.render("./pages/panel/create-post.ejs", {
                options: [],
                categories,
                category: 'yourCategoryValue',
                showBack: true
            })
        } catch (error) {
            next(error)
        }
    }

    async create(req, res, next) {
        try {

        } catch (error) {
            next(error)
        }
    }

    async find(req, res, next) {
        try {

        } catch (error) {
            next(error)
        }
    }

    async remove(req, res, next) {
        try {
        } catch (error) {

        }
    }
}

module.exports = new PostController()