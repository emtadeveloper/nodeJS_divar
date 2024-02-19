const autoBind = require("auto-bind");
const OptionService = require("./option.service");
const {OptionMessage} = require("./option.message");
const {StatusCodes} = require('http-status-codes')

class OptionController {
    #service;

    constructor() {
        autoBind(this)
        this.#service = OptionService
    }

    async removeById(req, res, next) {
        try {
            const {id} = req.params
            await this.#service.removeById(id)
            return res.json({message: OptionMessage.Deleted})
        } catch (error) {
            next(error)
        }
    }

    async create(req, res, next) {
        try {
            const {title, key, guid, enum: list, type, category, required} = req.body;
            await this.#service.create({title, key, guid, enum: list, type, category, required})
            return res.status(StatusCodes.CREATED).json({
                message: OptionMessage.Created
            })
        } catch (error) {
            next(error)
        }
    }

    async update(req, res, next) {
        try {
            const {title, key, guid, enum: list, type, category, required} = req.body
            const {id} = req.params
            await this.#service.update(id, {title, key, guid, enum: list, required, type, category})
            return res.status(StatusCodes.CREATED).json({
                message: OptionMessage.Updated
            })
        } catch (error) {
            next(error)
        }
    }

    async find(req, res, next) {
        try {
            const options = await this.#service.find()
            return res.json(options)
        } catch (error) {
            next(error)
        }
    }

    async findByCategoryById(req, res, next) {
        try {
            const {categoryId} = req.params
            console.log(categoryId)
            const options = await this.#service.findByCategoryId(categoryId)
            return res.json({options})
        } catch (error) {
            next(error)
        }
    }

    async findCategorySlug(req, res, next) {
        try {
            const {slug} = req.params;
            const options = await this.#service.findByCategorySlug(slug);
            return res.json(options)
        } catch (error) {
            next(error)
        }
    }

    async findById(req, res, next) {
        const {id} = req.params
        const options = await this.#service.findById(id)
        return res.json({options})
    }
}

module.exports = new OptionController()