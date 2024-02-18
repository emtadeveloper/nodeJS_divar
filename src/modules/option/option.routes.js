const {Router} = require('express')
const OptionController = require('./option.controller')

const router = Router()

router.post("/", OptionController.create)
router.get("/", OptionController.find)
router.get("/by-category/:categoryId", OptionController.findByCategoryById)
router.get("/:id", OptionController.findById)


module.exports = {
    OptionRouter: router
}

