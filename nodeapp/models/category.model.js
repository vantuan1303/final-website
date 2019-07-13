const mongoose = require('../database/database')
const Schema = mongoose.Schema

const CategorySchema = new Schema({
    title: {type: String, unique: true},
    description: String,
    date: {type: Date, default: Date.now},
    author: {type: Schema.Types.ObjectId, ref: "User"},
    products: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]
})

const Category = mongoose.model("Category", CategorySchema)
module.exports = Category