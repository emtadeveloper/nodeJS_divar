const {AuthMessage} = require('./auth.message')
const authService = require("./auth.service")
const NodeEnv = require('../../common/constant/env.enum')
const autoBind = require("auto-bind");
const UserModel = require("../user/user.model");
const UserService = require('../../modules/user/user.service')


class UserController {
    #service

    constructor() {
        autoBind(this)
        this.#service = UserService
    }
}

module.exports = new UserController()