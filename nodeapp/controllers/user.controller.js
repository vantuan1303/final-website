const User = require('../models/user.model')
const authController = require('./auth.controller')
const postController = require('./post.controller')
const bcrypt = require('bcrypt')

const create = async (name, email, password) => {
    try {
	    const encryptedPassword = await bcrypt.hash(password, 10)//saltRounds = 10
        const newUser = new User()
        newUser.name = name
        newUser.email = email
        newUser.password = encryptedPassword
        await newUser.save()
    } catch(error) {
        if (error.code === 11000) {
        	throw "Email already exists"
        }
        throw error
    }
}

const blockByIds = async (userIds, tokenKey) => {
    //Admin có thể khoá nhiều user một lúc
    try {
        let signedInUser = await authController.verifyJWT(tokenKey)
        if (signedInUser.permission !== 2){
            throw "Chỉ có tài khoản admin mới có chức năng này"
        }
        userIds.forEach(async (userId) => {
            let user = await User.findById(userId)
            if (!user) { //Ko thấy user
                return
            }
            user.isBanned = 1
            await user.save()
        })
    } catch(error) {
        throw error
    }
}

const deleteByIds = async (userIds, tokenKey) => {
    //Admin có thể xoá nhiều user một lúc
    try {
        let signedInUser = await authController.verifyJWT(tokenKey)
        if (signedInUser.permission !== 2){
            throw "Chỉ có tài khoản admin mới có chức năng này"
        }
        userIds.forEach(async (userId) => {
            let user = await User.findById(userId)
            if (!user) { //Ko thấy user
                return
            }
            await postController.deleteByAuthor(userId)
            await User.findByIdAndDelete(userId)
        })
    } catch(error) {
        throw error
    }
}

module.exports = {
    create, blockByIds, deleteByIds
}