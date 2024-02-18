const {Schema, Types, model} = require("mongoose")

const OptionSchema = new Schema({
    title: {type: String, required: true},
    key: {type: String, required: true},
    types: {type: String, enum: ["number", "string", "array", "boolean"]},
    enum: {type: Array, default: []},
    guid: {type: String, required: false},
    category: {type: Types.ObjectId, ref: 'Category', required: true}

})

const OptionModel = model('option', OptionSchema)

module.exports = OptionModel