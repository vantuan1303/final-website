const mongoose = require('../database/database')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: { type: String, match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, unique: true, required: true },
    name: { type: String, default: this.userName },
    password: { type: String, required: true },
    permission: { type: Number, default: 0 }, //0: user, 1: moderator, 2: admin
    isBanned: { type: Number, default: 0 }, //1: banned
    date: { type: Date, default: Date.now },
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }]
})

const User = mongoose.model('User', UserSchema)
module.exports = User