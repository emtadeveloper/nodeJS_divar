const {Schema, Types, model} = require("mongoose")


const PostSchema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    category: {type: Types.ObjectId, ref: 'Category', required: true},
    province: {type: String, required: false},
    city: {type: String, required: false},
    userId:{type:Types.ObjectId , required:true},
    district: {type: String, required: false},
    coordinate: {type: [Number], required: true}, // 52.44864866   25.54646546
    images: {type: [String], required: false, default: []},
    options:{type:Object,default: {}}
})

const PostModel = model("post", PostSchema)
module.exports = PostModel