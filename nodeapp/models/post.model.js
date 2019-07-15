const mongoose = require('../database/database')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    title: { type: String, unique: true },
    thumbnail: String,
    description: String,
    content: String,
    date: { type: Date, default: Date.now },
    tags: [{ type: String }],
    author: { type: Schema.Types.ObjectId, ref: "User" },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }]
})

const Post = mongoose.model("Post", PostSchema)
module.exports = Post