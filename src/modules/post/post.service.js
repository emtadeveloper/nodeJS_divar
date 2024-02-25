const autoBind = require("auto-bind");
const PostModel = require("./post.model");
const createHttpError = require("http-errors");
const {StatusCodes} = require("http-status-codes");
const {PostMessage} = require("./post.message");
const {isValidObjectId, Types} = require("mongoose")
const OptionModel = require("../option/option.model")
const slugify = require("slugify");
const {post} = require("axios");

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

    async checkExist(postId) {
        if (!postId || !isValidObjectId(postId)) throw new createHttpError(StatusCodes.BAD_REQUEST, PostMessage.RequestNotValid)
        const [post] = await this.#model.aggregate([
            {$match: {_id: new Types.ObjectId(postId)}},
            {
                $lookup: {from: 'users', localField: 'userId', foreignField: '_id', as: 'user'},
            },
            {
                $unwind: {path: '$user', preserveNullAndEmptyArrays: true}
            },
            {
                $addFields: {userMobile: "$user.mobile"}
            },
            {
                $project: {user: 0}
            }

        ])

        if (!post) throw new createHttpError(StatusCodes.NOT_FOUND, PostMessage.NOT_FOUND)
        return post
    }

    async remove(postId) {
        await this.checkExist(postId)
        await this.#model.deleteOne({_id: postId})
    }

}


module.exports = new PostService()