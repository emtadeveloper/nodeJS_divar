const autoBind = require('auto-bind')
const UserModel = require('../user/user.model')
const {BadRequest, NOTFOUND, Unauthorized} = require("http-errors");
const {UserMessage} = require('./user.message')
const {randomInt} = require("crypto");
const jwt = require('jsonwebtoken');

class UserService {
    #model;
    constructor() {
        autoBind(this)
        this.#model = UserModel
    }
}

module.exports = new UserService()

