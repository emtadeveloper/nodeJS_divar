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

    async create(req, res, next) {
        try {
            const {title, key, guid, enum: list, type, category} = req.body
            await this.#service.create({title, key, guid, enum: list, type, category})
            return res.status(StatusCodes.CREATED).json({
                message: OptionMessage.Created
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
        const {categoryId} = req.params
        const options = await this.#service.findByCategoryId(categoryId)
        return res.json({options})
    }

    async findById(req, res, next) {
        const {id} = req.params
        const options = await this.#service.findById(id)
        return res.json({options})
    }
}

module.exports = new OptionController()