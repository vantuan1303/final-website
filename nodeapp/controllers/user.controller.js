const User = require('../models/user.model')
const Post = require('../models/post.model')
const Category = require('../models/category.model')
const Comment = require('../models/comment.model')
const authController = require('./auth.controller')

// const postController = require('./post.controller')
// const categoryController = require('./category.controller')
const bcrypt = require('bcrypt')

const create = async (name, email, password) => {
    try {
        const encryptedPassword = await bcrypt.hash(password, 10)//saltRounds = 10
        const newUser = new User()
        newUser.name = name
        newUser.email = email
        newUser.password = encryptedPassword
        newUser.save()
    } catch (error) {
        if (error.code === 11000) throw "Email already exists"
        throw error
    }
}

const blockByIds = async (userIds, tokenKey) => {
    let arrayUserIds = userIds.split(',').map(item => {
        return item.trim()
    })
    try {
        let signedInUser = await authController.verifyJWT(tokenKey)
        if (signedInUser.permission !== 2) {
            throw "Chỉ có tài khoản admin mới có chức năng này"
        }
        User.updateMany({ _id: { $in: arrayUserIds } }, { isBanned: 1 })
    } catch (error) {
        throw error
    }
}

const deleteByIds = async (userIds, tokenKey) => {
    let arrayUserIds = userIds.split(',').map(item => {
        return item.trim()
    })
    try {
        let signedInUser = await authController.verifyJWT(tokenKey)
        if (signedInUser.permission !== 2) {
            throw "Only admin can do this action"
        }
        for (userId of arrayUserIds) {
            let user = await User.findByIdAndDelete(userId)
            if (!user) {
                throw "User not found"
            }
            await Post.deleteMany({ author: authorId })
            await Comment.deleteMany({ author: authorId })
            // await Category.deleteMany({ author: authorId })
        }
    } catch (error) {
        throw error
    }
}

module.exports = {
    create, blockByIds, deleteByIds
}