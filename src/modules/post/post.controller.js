const autoBind = require("auto-bind");
const CategoryModel = require("../category/category.model")
const PostService = require("./post.service");
const {PostMessage} = require("./post.message");
const {StatusCodes} = require('http-status-codes')
const createHttpError = require("http-errors");
const {OptionMessage} = require("../option/option.message");

class PostController {
    #service;

    constructor() {
        autoBind(this)
        this.#service = PostService
    }

    async createPostPage(req, res, next) {
        try {
            let {slug} = req.query
            let match = {parent: null}
            let showBack = false
            let options
            if (slug) {
                slug = slug.trim()
                const category = await CategoryModel.findOne({slug})
                if (!category) throw new createHttpError(StatusCodes.NOT_FOUND, PostMessage.NotFound)
                options = await this.#service.getCategoryOptions(category.id)
                if(options.length ===0) options = null
                showBack = true

                match = {
                    parent: category._id
                }
            } else {
            }
            const categories = await CategoryModel.aggregate([{$match: match}])
            res.render("./pages/panel/create-post.ejs", {
                options,
                categories,
                category: 'yourCategoryValue',
                showBack
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