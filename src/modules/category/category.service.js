const autoBind = require("auto-bind");
const CategoryModel = require("./category.model");
const createHttpError = require("http-errors");
const {StatusCodes} = require("http-status-codes");
const {CategoryMessage} = require("./category.message");
const {isValidObjectId, Types} = require("mongoose")
const OptionModel = require("../option/option.model")
const slugify = require("slugify");

class CategoryService {
    #model;
    #optionModel;

    constructor() {
        autoBind(this)
        this.#optionModel = OptionModel
        this.#model = CategoryModel
    }

    async find() {
        // populate :  اون ویرچوال که در مدل تعریف کردیم رو مییاد و فراخانی میکنه و اجراش میکنه
        // return await this.#model.find({parents: {$exists: false}}).populate([{path: 'children'}])  //
        return await this.#model.find({parent: {$exists: false}});

    }

    async remove(id) {
        await this.checkExistById(id)
        await this.#optionModel.deleteMany({category: id}).then((async () => {
            await this.#model.deleteMany({_id: id})
        }))
        return true
    }

    async created(categoryDTO) {
        if (categoryDTO?.parent && isValidObjectId(categoryDTO.parent)) {
            const existCategory = await this.checkExistById(categoryDTO.parent)
            categoryDTO.parent = existCategory._id
            categoryDTO.parents = [
                ...new Set(
                    ([existCategory._id.toString()].concat(
                        existCategory.parents.map(id => id.toString())
                    )).map(id => new Types.ObjectId(id))
                )
            ]
        }
        if (categoryDTO?.slug) {
            categoryDTO.slug = slugify(categoryDTO.slug)
            await this.alreadyExistBySlug(categoryDTO.slug)
        } else {
            categoryDTO.slug = slugify(categoryDTO.name)
        }
        const category = await this.#model.create(categoryDTO)
        return category
    }

    async checkExistById(id) {
        const category = await this.#model.findById(id)
        if (!category) throw  new createHttpError(StatusCodes.NOTFOUND, CategoryMessage.NotFound)
        return category
    }

    async alreadyExistBySlug(slug) {
        const category = await this.#model.findOne({slug})
        if (category) throw  new createHttpError(StatusCodes.CONFLICT, CategoryMessage.AlreadyExist)
        return null
    }
}

module.exports = new CategoryService()