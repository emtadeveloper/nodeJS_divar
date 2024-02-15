const {UserMessage} = require('./user.message')
const NodeEnv = require('../../common/constant/env.enum')
const autoBind = require("auto-bind");
const UserModel = require("../user/user.model");
const UserService = require('./user.service')


class UserController {
    #service

    constructor() {
        autoBind(this)
        this.#service = UserService
    }

    async whoAmI(req, res, next) {
        try {
            const user = req.user
            return res.json(user)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new UserController()