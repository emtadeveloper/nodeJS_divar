const autoBind = require("auto-bind");
const OptionModel = require("./option.model");
const createHttpError = require("http-errors");
const {StatusCodes, NOT_FOUND} = require("http-status-codes");
const {OptionMessage} = require("./option.message");
const {isValidObjectId, Types} = require("mongoose")
const CategoryModel = require("../category/category.model");
const slugify = require("slugify");

class OptionService {
    #model;
    #categoryModel

    constructor() {
        autoBind(this)
        this.#model = OptionModel
        this.#categoryModel = CategoryModel
    }

    async find() {
        const options = await this.#model.find({}, {_v: 0}, {$sort: {id: -1}}).populate({
            path: "category",
            select: {name: 1, slug: 1}
        })
        return options
    }

    async findById(id) {
        return await this.checkExistById(id)
    }

    async findByCategoryId(categoryId) {
        return await this.#model.findOne({categoryId}, {__v: 0}).populate({
            path: "category",
            select: {name: 1, slug: 1}
        })
    }

    async created(optionDTO) {
        const category = await this.checkExistById(optionDTO.category)
        optionDTO.category = category._id
        optionDTO.key = slugify(optionDTO.key, {trim: true, replacement: "_", lower: true})
        await this.alreadyExistByCategoryAndKey(optionDTO.key, category._id)
        if (optionDTO?.enum && typeof optionDTO.enum === "string") {
            optionDTO.enum = optionDTO.enum.split(",")
        } else if (Array.isArray(optionDTO.enum)) optionDTO.enum = []
        const option = await this.#model.create(optionDTO)
        return option
    }

    async checkExistById(id) {
        const category = await this.#model.findById(id)
        if (!category) throw new createHttpError(StatusCodes.NOT_FOUND, OptionMessage.NotFound)
        return category
    }

    async alreadyExistByCategoryAndKey(key, category) {
        const isExist = await this.#model.findOne(category, key)
        if (!isExist) throw new createHttpError(StatusCodes.CONFLICT, OptionMessage.AlreadyExist)
        return null
    }
}

module.exports = new OptionService()