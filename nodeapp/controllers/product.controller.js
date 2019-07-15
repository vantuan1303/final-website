const authController = require('./auth.controller')
const Product = require('../models/product.model')
const Category = require('../models/category.model')
const categoryController = require('./category.controller')

const addToCategories = async (product, titleCategories) => {
    try {
        let arrayTitleCategories = titleCategories.split(',').map(item => {
            return item.trim()
        })
        for (let titleCategory of arrayTitleCategories) {
            let category = await categoryController.searchOne(titleCategory)
            await category.products.push(product._id)
            await category.save()
            await product.categories.push(category._id)
        }
        await product.save()
    } catch (error){
        throw error
    }
}

const add = async (product, tokenKey) => {
    let { name, code, description, tags, categories } = product
    try {
        let signedInUser = await authController.verifyJWT(tokenKey)
        let arrayTags = tags.split(',').map(item => {
            return item.trim()
        })
        let newProduct = await Product.create({
            name, code, description,
            tags: arrayTags,
            author: signedInUser._id,
        })
        await newProduct.save()
        addToCategories(newProduct, categories)
        await signedInUser.products.push(newProduct._id)
        await signedInUser.save()
        return newProduct
    } catch (error) {
        throw error
    }
}

const search = async (text) => {
    try {
        let products = await Product.find({
            $or: [
                {
                    name: new RegExp(text, "i")
                },
                {
                    code: new RegExp(text, "i")
                }
            ],
        })
        return products
    } catch (error) {
        throw error
    }
}

const searchByCategory = async (text) => {
    try {
        let category = await categoryController.searchOne(text)
        let productIds = await category.products
        let products = Product.find({
            '_id': productIds
        })
        return products
    } catch (error) {
        throw error
    }
}

// //Get product from date A to date B
// //VD1: http://127.0.0.1:3000/products/queryproductsByDateRange?from=01-11-2018&to=05-11-2018
const searchByDateRange = async (from, to) => {
    //format: dd-mm-yyyy    
    let fromDate = new Date(parseInt(from.split('-')[2]),
        parseInt(from.split('-')[1]) - 1,
        parseInt(from.split('-')[0]))
    let toDate = new Date(parseInt(to.split('-')[2]),
        parseInt(to.split('-')[1]) - 1,
        parseInt(to.split('-')[0]) + 1)
    try {
        let products = await Product.find({
            date: { $gte: fromDate, $lte: toDate },
        })
        return products
    } catch (error) {
        throw error
    }
}

const getDetailById = async (id) => {
    try {
        let product = await Product.findById(id)
        if (!product) {
            throw `Can not find product with Id=${id}`
        }
        return product
    } catch (error) {
        throw error
    }
}

const deleteInCategories = async (product) => {
    try {
        let categoryIds = await product.categories
        let categories = await Category.find({
            "_id": categoryIds
        })
        for (category of categories){
            category.products = await category.products.filter(eachProduct => {
                return product._id.toString() !== eachProduct._id.toString()
            })
            await category.save()
        }
    } catch (error){
        throw error
    }
}

const update = async (id, updatedProduct, tokenKey) => {
    try {
        let signedInUser = await authController.verifyJWT(tokenKey)
        let { name, code, description, tags, categories } = updatedProduct
        let product = await Product.findById(id)
        if (!product) {
            throw `Can not find product with Id=${id}`
        }
        if (signedInUser.id !== product.author.toString()) {
            throw "Can not update because you are not product's author"
        }
        product.name = !name ? product.name : name
        product.code = !code ? product.code : code
        product.description = !description ? product.description : description
        product.tags = !tags ? product.tags : tags
        product.date = Date.now()
        if (!categories){
            product.categories
        } else {
            await deleteInCategories(product)
            product.categories = []
            await addToCategories(product, categories)
        }
        await product.save()
        return product
    } catch (error) {
        throw error
    }
}

const deleteInUser = async (product, user) => {
    try {
        user.products = await user.products
            .filter(eachProduct => {
                return product._id.toString() !== eachProduct._id.toString()
            })
        await user.save()
    } catch (error){
        throw error
    }
}

const deleteById = async (id, tokenKey) => {
    try {
        let signedInUser = await authController.verifyJWT(tokenKey)
        let product = await Product.findById(id)
        if (!product) {
            throw `Can not find product with Id=${id}`
        }
        if (signedInUser.id !== product.author.toString()) {
            throw "Can not delete record because you are not author"
        }
        await deleteInCategories(product)
        await deleteInUser(product, signedInUser)
        await Product.deleteOne({ _id: id })
    } catch (error) {
        throw error
    }
}

const deleteByAuthor = async (authorId) => {
    try {
        await Product.deleteMany({
            author: authorId
        })
    } catch (error) {
        throw error
    }
}

module.exports = {
    add,
    search,
    searchByCategory,
    searchByDateRange,
    getDetailById,
    update,
    deleteById,
    deleteByAuthor
}