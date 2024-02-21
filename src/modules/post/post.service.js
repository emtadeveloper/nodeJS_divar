const autoBind = require("auto-bind");
const PostModel = require("./post.model");
const createHttpError = require("http-errors");
const {StatusCodes} = require("http-status-codes");
const {PostMessage} = require("./post.message");
const {isValidObjectId, Types} = require("mongoose")
const OptionModel = require("../option/option.model")
const slugify = require("slugify");

class PostService {
    #model;
    #optionModel;

    constructor() {
        autoBind(this)
        this.#optionModel = OptionModel
        this.#model = PostModel
    }

    async getCategoryOptions(categoryId) {
        const options = await this.#optionModel.find({category: categoryId})
        return options
    }
}

module.exports = new PostService()