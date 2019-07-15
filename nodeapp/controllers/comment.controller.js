const authController = require('./auth.controller')
const Comment = require('../models/comment.model')
const Product = require('../models/product.model')
const Post = require('../models/post.model')

const addOnPost = async (comment, postId, tokenKey) => {
    let { title, rate, content } = comment
    try {
        let signedInUser = await authController.verifyJWT(tokenKey)
        let post = await Post.findById(postId)
        if (!post) throw `Can not find post with id = ${postId}`
        let newComment = await Comment.create({
            title, rate, content,
            author: signedInUser._id,
            commentOn: post._id,
            onModel: "Post"
        })
        await newComment.save()
        await post.comments.push(newComment._id)
        post.save()
        await signedInUser.comments.push(newComment._id)
        signedInUser.save()
        return newComment
    } catch (error) {
        throw error
    }
}

const addOnProduct = async (comment, productId, tokenKey) => {
    let { title, rate, content } = comment
    try {
        let signedInUser = await authController.verifyJWT(tokenKey)
        let product = await Product.findById(productId)
        if (!product) throw `Can not find product with id = ${productId}`
        let newComment = await Comment.create({
            title, rate, content,
            author: signedInUser._id,
            commentOn: product._id,
            onModel: "Product"
        })
        await newComment.save()
        await product.comments.push(newComment._id)
        product.save()
        await signedInUser.comments.push(newComment._id)
        signedInUser.save()
        return newComment
    } catch (error) {
        throw error
    }
}



// const search = async (text) => {
//     try {
//         let comments = await comment.find({
//             $or: [
//                 {
//                     name: new RegExp(text, "i")
//                 },
//                 {
//                     code: new RegExp(text, "i")
//                 }
//             ],
//         })
//         return comments
//     } catch (error) {
//         throw error
//     }
// }

// const searchByCategory = async (text) => {
//     try {
//         let category = await categoryController.searchOne(text)
//         let commentIds = await category.comments
//         let comments = comment.find({
//             '_id': commentIds
//         })
//         return comments
//     } catch (error) {
//         throw error
//     }
// }

// const searchByDateRange = async (from, to) => {
//     //format: dd-mm-yyyy    
//     let fromDate = new Date(parseInt(from.split('-')[2]),
//         parseInt(from.split('-')[1]) - 1,
//         parseInt(from.split('-')[0]))
//     let toDate = new Date(parseInt(to.split('-')[2]),
//         parseInt(to.split('-')[1]) - 1,
//         parseInt(to.split('-')[0]) + 1)
//     try {
//         let comments = await comment.find({
//             date: { $gte: fromDate, $lte: toDate },
//         })
//         return comments
//     } catch (error) {
//         throw error
//     }
// }

// const getDetailById = async (id) => {
//     try {
//         let comment = await comment.findById(id)
//         if (!comment) {
//             throw `Can not find comment with Id=${id}`
//         }
//         return comment
//     } catch (error) {
//         throw error
//     }
// }

// const deleteInCategories = async (comment) => {
//     try {
//         let categoryIds = await comment.categories
//         let categories = await Category.find({
//             "_id": categoryIds
//         })
//         for (category of categories){
//             category.comments = await category.comments.filter(eachcomment => {
//                 return comment._id.toString() !== eachcomment._id.toString()
//             })
//             await category.save()
//         }
//     } catch (error){
//         throw error
//     }
// }

// const update = async (id, updatedcomment, tokenKey) => {
//     try {
//         let signedInUser = await authController.verifyJWT(tokenKey)
//         let { name, code, description, tags, categories } = updatedcomment
//         let comment = await comment.findById(id)
//         if (!comment) {
//             throw `Can not find comment with Id=${id}`
//         }
//         if (signedInUser.id !== comment.author.toString()) {
//             throw "Can not update because you are not comment's author"
//         }
//         comment.name = !name ? comment.name : name
//         comment.code = !code ? comment.code : code
//         comment.description = !description ? comment.description : description
//         comment.tags = !tags ? comment.tags : tags
//         comment.date = Date.now()
//         if (!categories){
//             comment.categories
//         } else {
//             await deleteInCategories(comment)
//             comment.categories = []
//             await addToCategories(comment, categories)
//         }
//         await comment.save()
//         return comment
//     } catch (error) {
//         throw error
//     }
// }

// const deleteInUser = async (comment, user) => {
//     try {
//         user.comments = await user.comments
//             .filter(eachcomment => {
//                 return comment._id.toString() !== eachcomment._id.toString()
//             })
//         await user.save()
//     } catch (error){
//         throw error
//     }
// }

// const deleteById = async (id, tokenKey) => {
//     try {
//         let signedInUser = await authController.verifyJWT(tokenKey)
//         let comment = await comment.findById(id)
//         if (!comment) {
//             throw `Can not find comment with Id=${id}`
//         }
//         if (signedInUser.id !== comment.author.toString()) {
//             throw "Can not delete record because you are not author"
//         }
//         await deleteInCategories(comment)
//         await deleteInUser(comment, signedInUser)
//         await comment.deleteOne({ _id: id })
//     } catch (error) {
//         throw error
//     }
// }

// const deleteByAuthor = async (authorId) => {
//     try {
//         await comment.deleteMany({
//             author: authorId
//         })
//     } catch (error) {
//         throw error
//     }
// }

module.exports = {
    addOnPost,
    addOnProduct
    // search,
    // searchByCategory,
    // searchByDateRange,
    // getDetailById,
    // update,
    // deleteById,
    // deleteByAuthor
}