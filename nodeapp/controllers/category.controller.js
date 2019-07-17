const authController = require('./auth.controller')
const Category = require('../models/category.model')
const User = require('../models/user.model')

const searchList = async (text) => {
    try {
        let categories = await Category.find({
            title: new RegExp(text, "i")
        })
        return categories
    }
    catch (error) {
        throw error
    }
}

const searchOne = async (text) => {
    try {
        let category = await Category.findOne({
            title: new RegExp("^" + text + "$", "i")
        })
        return category
    }
    catch (error) {
        throw error
    }
}

const showAll = async () => {
    try {
        let category = await Category.find()
        return category
    } catch (error) {
        throw error
    }
}

const create = async (title, description, tokenKey) => {
    try {
        let signedInUser = await authController.verifyJWT(tokenKey)
        let newCategory = await Category.create({
            title,
            description,
            author: signedInUser._id
        })
        signedInUser.categories.push(newCategory._id)
        signedInUser.save()
        return newCategory
    } catch (error) {
        throw error
    }
}

const update = async (id, updatedCategory, tokenKey) => {
    try {
        let signedInUser = await authController.verifyJWT(tokenKey)
        let { title, description } = updatedCategory
        const query = {
            ...(title && { title }),
            ...(description && { description }),
            date: Date.now(),
        }
        const category = await Category.findOneAndUpdate(
            { _id: id, author: signedInUser.id }, query, { new: true }
        )
        if (!category) throw `Can not find category with Id = ${id} or you are not author`
        return category
    } catch (error) {
        throw error
    }
}

const deleteById = async (id, tokenKey) => {
    try {
        let signedInUser = await authController.verifyJWT(tokenKey)
        let category = await Category.findOneAndDelete({
            _id: id, author: signedInUser.id
        })
        if (!category) throw `Can not find category with Id=${id} or you are not author`
        await User.updateMany(
            { categories: id }, { $pull: { categories: id } }
        )
    } catch (error) {
        throw error
    }
}

module.exports = { searchList, searchOne, showAll, create, update, deleteById }