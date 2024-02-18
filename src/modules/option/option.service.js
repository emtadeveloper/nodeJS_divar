const autoBind = require("auto-bind");
const OptionModel = require("./option.model");
const createHttpError = require("http-errors");
const {StatusCodes, NOT_FOUND} = require("http-status-codes");
const {OptionMessage} = require("./option.message");
const {isValidObjectId, Types} = require("mongoose")
const slugify = require("slugify");

class OptionService {
    #model;

    constructor() {
        autoBind(this)
        this.#model = OptionModel
    }

    async removeById(id) {
        await this.checkExistById(id)
        return await this.#model.deleteOne({_id: id})
    }

    async find() {
        return await this.#model.find({}, {_v: 0}, {$sort: {id: -1}}).populate({
            path: "category",
            select: {name: 1, slug: 1}
        })
    }

    async findById(id) {
        return await this.checkExistById(id)
    }

    async findByCategoryId(categoryId) {
        return await this.#model.findOne({categoryId}, {__v: 0}).populate({
            path: "category",
            select: {name: 1, slug: 1}
        })
    }

    async findByCategorySlug(slug) {
        //aggregate  یک سری پاپ لاین داره که هر کدوم از این پاپ لاین ها یک کاری رو انجام میدهند
        // match  برای فیلتر کردن یا پیدا کردن دیتا
        // lockup :  که مثل  populate  هستش
        //_ from :  روی چه جدولی در دیتابس بیاد اسم اون جدول در مانگودی بی
        //_ localField :  در داخل اون جدول بالایی که مشخص کردی میخای بر اساس کدوم فیلد جدولش باشه
        //_  forignField :  اسم اون فیلد در داخل جدول دیتابسی که الان در داخل مدل اش هستیم که در اینجا آپشن هستش که اسم فیلد چیه مقدار دسته بندی که آیدی هستش
        // مفاهیم دو تا فیلد بالایی بر عکس هستند حواست باشه
        // که میخایم به جای آیدی بالایی  بیاد و کل اون مقادیر رو به جاش قرار بده
        // با تغیرات بالا به ما در قالب یک ارایه از آبجکت ها می دهد

        // unwind : با دادن نام فیلد که در پاییس مشخص کردیم میتونیم مشخص کنیم که بیاد و مقدار رو از آرایه خارج کنه و یک آبجکت تحویل ما بده

        //  as   میگوید حالا بیا و یک اسم رو براش انتخاب بکن
        // project :  که میشه یکسری مقدار رو اضافه یا کم کنیم
        // addFields  میتونیم بیایم و یک فیلد جدید رو اضافه کنیم
        const options = await this.#model.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: "_id",
                    as: 'category'
                }
            },
            {
                $unwind: "$category"
            },
            {
                $addFields: {
                    categorySlug: "$category.slug",
                    categoryName: "$category.name",
                    categoryIcon: "$category.icon"
                }
            },
            {
                $project: {
                    category: 0,
                    __v: 0
                }
            },
            {
                $match: {
                    categorySlug: slug
                }
            }
        ])
    }

    async created(optionDTO) {
        const category = await this.checkExistById(optionDTO.category)
        optionDTO.category = category._id
        optionDTO.key = slugify(optionDTO.key, {trim: true, replacement: "_", lower: true})
        await this.alreadyExistByCategoryAndKey(optionDTO.key, category._id)
        if (optionDTO?.enum && typeof optionDTO.enum === "string") {
            optionDTO.enum = optionDTO.enum.split(",")
        } else if (Array.isArray(optionDTO.enum)) optionDTO.enum = []
        const option = await this.#model.create(optionDTO)
        return option
    }

    async checkExistById(id) {
        const category = await this.#model.findById(id)
        if (!category) throw new createHttpError(StatusCodes.NOT_FOUND, OptionMessage.NotFound)
        return category
    }

    async alreadyExistByCategoryAndKey(key, category) {
        const isExist = await this.#model.findOne(category, key)
        if (!isExist) throw new createHttpError(StatusCodes.CONFLICT, OptionMessage.AlreadyExist)
        return null
    }
}

module.exports = new OptionService()