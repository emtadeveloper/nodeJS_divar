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

    async create(dto) {
        const DTO = await this.#model.create(dto)
        return DTO
    }

    async find(userId) {
        if (userId && isValidObjectId(userId)) return await this.#model.find({userId})
        throw new createHttpError(StatusCodes.BAD_REQUEST, PostMessage.RequestNotValid)
    }

    async getCategoryOptions(categoryId) {
        const options = await this.#optionModel.find({category: categoryId})
        return options
    }
}

module.exports = new PostService()