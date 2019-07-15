const authController = require('./auth.controller')
const Category = require('../models/category.model')

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
        let categories = await Category.find({
            title: new RegExp("^" + text + "$", "i")
        })
        return categories[0]
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
        await newCategory.save()
        await signedInUser.categories.push(newCategory._id)
        await signedInUser.save()
        return newCategory
    } catch (error) {
        throw error
    }
}

const update = async (id, updatedCategory, tokenKey) => {
    try {
        let signedInUser = await authController.verifyJWT(tokenKey)
        let { title, description } = updatedCategory
        let category = await Category.findById(id)
        if (!category) {
            throw `Can not find category with Id=${id}`
        }
        if (signedInUser.id !== category.author.toString()) {
            throw "Can not update because you are not category's author"
        }
        category.title = !title ? category.title : title
        category.description = !description ? category.description : description
        category.date = Date.now()
        await category.save()
        return category
    } catch (error) {
        throw error
    }
}
// //Delete blogcategory
// //1. Delete a record in category
// //2. Update reference field "category" in Users
// //=> mảng category bớt đi 1 phần tử
const deleteById = async (id, tokenKey) => {
    try {
        let signedInUser = await authController.verifyJWT(tokenKey)
        let category = await Category.findById(id)
        if (!category) {
            throw `Can not find category with Id=${id}`
        }
        if (signedInUser.id !== category.author.toString()) {
            throw "Can not delete record because you are not author"
        }
        await category.deleteOne({ _id: id })
        signedInUser.categories = await signedInUser.categories
            .filter(eachcategory => {
                return category._id.toString() !== eachcategory._id.toString()
            })
        await signedInUser.save()
    } catch (error) {
        throw error
    }
}

const deleteByAuthor = async (authorId) => {
    try {
        await Category.deleteMany({
            author: authorId
        })
    } catch (error) {
        throw error
    }
}

module.exports = { searchList, searchOne, showAll, create, update, deleteById, deleteByAuthor }