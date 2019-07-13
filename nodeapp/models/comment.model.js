const mongoose = require('../database/database')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    title: String,
    rate: Number,
    content: String,
    date: {type: Date, default: Date.now},
    author: {type: Schema.Types.ObjectId, ref: "User"},
    on: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        required: true,
        enum: ['Post, Product']
    }
})

const Comment = mongoose.model("Comment", CommentSchema)
module.exports = Comment 