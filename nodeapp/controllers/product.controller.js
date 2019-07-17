const authController = require('./auth.controller')
const Product = require('../models/product.model')
const Category = require('../models/category.model')
const categoryController = require('./category.controller')

const findCategoryIdsFromCategoryTitles = async (titles) => {
    try {
        let arrayObject = await Category.find({ title: { $in: titles } }).select('_id')
        let array = arrayObject.map(item => item["_id"].toString())
        return array
    } catch (error) {
        throw error
    }
}

const addToCategories = async (productId, categoryIds) => {
    try {
        await Category.updateMany(
            { _id: { $in: categoryIds } },
            { $push: {products: productId}}
        )
        // await Product.findByIdAndUpdate(
        //     productId,
        //     { $push: { categories: { $each: categoryIds } } }
        // )
    } catch (error) {
        throw error
    }
}

const add = async (product, tokenKey) => {
    let { name, code, description, tags, categories } = product
    let arrayTitleCategories = categories.split(',').map(item => {
        return item.trim()
    })
    try {
        let signedInUser = await authController.verifyJWT(tokenKey)
        let arrayTags = tags.split(',').map(item => {
            return item.trim()
        })
        let categoryIds = await findCategoryIdsFromCategoryTitles(arrayTitleCategories)
        let newProduct = await Product.create({
            name, code, description,
            tags: arrayTags,
            author: signedInUser._id,
            categories: categoryIds
        })
        addToCategories(newProduct._id, categoryIds)
        await signedInUser.update(
            { $push: { products: newProduct._id } }
        )
        return newProduct
    } catch (error) {
        throw error
    }
}

const search = async (text) => {
    try {
        let products = await Product.find({
            $or: [
                {name: new RegExp(text, "i")},
                {code: new RegExp(text, "i")}
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
        let productIds = category.products
        let products = await Product.find({'_id': productIds})
        return products
    } catch (error) {
        throw error
    }
}

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
        if (!product) throw `Can not find product with Id=${id}`
        return product
    } catch (error) {
        throw error
    }
}

const deleteInCategories = async (productId, categoryIds) => {
    try {
        await Category.updateMany(
            { _id: { $in: categoryIds } },
            { $pull: { products: productId } }
        )
    } catch (error){
        throw error
    }
}

const update = async (id, updatedProduct, tokenKey) => {
    let { name, code, description, tags, categories } = updatedProduct
    try {
        let signedInUser = await authController.verifyJWT(tokenKey)
        let product = await Product.findById(id)
        if (!product) throw `Can not find product with Id=${id}`
        if (signedInUser.id !== product.author.toString()) {
            throw "Can not update because you are not product's author"
        }
        if (categories){
            let arrayTitleCategories = categories.split(',').map(item => {
                return item.trim()
            })
            let categoryIds = await findCategoryIdsFromCategoryTitles(arrayTitleCategories)
            categories = categoryIds
        }
        let oldCategories = product.categories
        const query = {
            ...(name && {name}),
            ...(code && {code}),
            ...(description && {description}),
            ...(tags && {tags}),
            date: Date.now(),
            ...(categories && {categories}),
        }
        Promise.all([
            product = Product.findByIdAndUpdate(id, query, { new: true }),
            deleteInCategories(product._id, oldCategories),
            addToCategories(product._id, categories)
        ])
        return product
    } catch (error) {
        throw error
    }
}

    // const upTest = async (id, updatedProduct) => {
    //     let { name, code} = updatedProduct
    //     try {
    //         let product = await Product.findById(id)
    //         const query = {
    //             ...(name && {name}),
    //             ...(code && {code}),
    //         }
    //         product.update(query)
    //         return product
    //     } catch (error) {
    //         throw error
    //     }
    // }

const deleteInUser = (product, user) => {
    user.products = user.products
        .filter(eachProduct => {
            return product._id.toString() !== eachProduct._id.toString()
        })
    user.save()
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
        deleteInCategories(product)
        deleteInUser(product, signedInUser)
        Product.deleteOne({ _id: id })
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