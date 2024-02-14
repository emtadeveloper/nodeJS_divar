const autoBind = require('auto-bind')
const UserModel = require('../user/user.model')
const {BadRequest, NOTFOUND, Unauthorized} = require("http-errors");
const {AuthMessage} = require('./auth.message')
const {randomInt} = require("crypto");
const jwt = require('jsonwebtoken');

class UserService {

}

module.exports = new UserService()

