const autoBind = require("auto-bind");
const CategoryModel = require("../category/category.model")
const PostService = require("./post.service");
const {PostMessage} = require("./post.message");
const {StatusCodes} = require('http-status-codes')
const createHttpError = require("http-errors");
const {OptionMessage} = require("../option/option.message");
const {Types} = require("mongoose");
const axios = require("axios");
const {getAddresssDetail} = require("../../common/utils/http");
const {removePropertyInObject} = require("../../common/utils/function");
const {decode} = require("utf8");

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
            const category = await CategoryModel.findOne({slug})
            if (slug) {
                slug = slug.trim()
                if (!category) throw new createHttpError(StatusCodes.NOT_FOUND, PostMessage.NotFound)
                options = await this.#service.getCategoryOptions(category.id)
                if (options.length === 0) options = null
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
                category: category?._id.toString(),
                showBack
            })
        } catch (error) {
            next(error)
        }
    }

    async create(req, res, next) {
        try {
            const images = req?.files?.map(image => image?.path?.slice(7))
            const {title_post: title, description: content, lat, lng, category} = req.body
            const {address, city, district, province} = await getAddresssDetail(lat, lng)
            const options = removePropertyInObject(req.body, ['images', 'category', 'title_post', 'description', 'lat', 'lng']);
            for (let key in options) {
                let value = options[key]
                delete options[key]
                key = decode(key)
                options[key] = value

            }
            await this.#service.create({
                title,
                content,
                coordinates: [lat, lng],
                category: new Types.ObjectId(category),
                images,
                options, address, city, district, province
            })
            return res.status(StatusCodes.CREATED).json({message: PostMessage.Created})
        } catch (error) {
            next(error)
        }
    }

    async findMyPosts(req, res, next) {
        try {
            const userId = req.user._id
            const posts = await this.#service.find(userId)
            return res.render("./pages/panel/posts.ejs", {posts , count:posts.length})
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