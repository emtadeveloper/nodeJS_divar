const autoBind = require("auto-bind");
const CategoryService = require("./category.service");
const {CategoryMessage} = require("./category.message");
const {StatusCodes} = require('http-status-codes')

class CategoryController {
    #service;

    constructor() {
        autoBind(this)
        this.#service = CategoryService
    }

    async create(req, res, next) {
        try {
            const {name, icon, slug, parent} = req.body
            await this.#service.created({name, icon, slug, parent})
            return res.status(StatusCodes.OK).json({
                message: CategoryMessage.Created
            })
        } catch (error) {
            next(error)
        }
    }

    async find(req, res, next) {
        try {
            const categories = await this.#service.find()
            return res.status(StatusCodes.OK).json(categories)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new CategoryController()