const autoBind = require("auto-bind");
const CategoryModel = require("./category.model");

class CategoryService {
    #service;
    constructor() {
        autoBind(this)
        this.#service = CategoryModel
    }

    async created(req,res,next){}
}

module.exports = new CategoryService()