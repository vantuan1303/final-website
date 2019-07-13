const mongoose = require('../database/database')
const Schema = mongoose.Schema

const ProductSchema = new Schema({
    name: String,
    code: {type: String, unique: true},
    date: {type: Date, default: Date.now},
    thumbnail: String,
    shortDescription: String,
    description: String,
    tag: [{type: String}],
    isHidren: {type: Number, default: 0}, //1: hidren
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}],
    categories: [{type: Schema.Types.ObjectId, ref: "Category"}],
    author: {type: Schema.Types.ObjectId, ref: "User"}
})

const Product = mongoose.model("Product", ProductSchema)
module.exports = Product