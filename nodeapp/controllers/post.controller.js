const authController = require('./auth.controller')
const Post = require('../models/post.model')
const Comment = require('../models/comment.model')
const User = require('../models/user.model')

const add = async (post, tokenKey) => {
    let { title, content, description, tags } = post
    try {
        let signedInUser = await authController.verifyJWT(tokenKey)
        let arrayTags = tags.split(',').map(item => {
            return item.trim()
        })
        let newBlogPost = await Post.create({
            title, content, description,
            tags: arrayTags,
            author: signedInUser._id,
        })
        signedInUser.posts.push(newBlogPost._id)
        signedInUser.save()
        return newBlogPost
    } catch (error) {
        throw error
    }
}

const search = async (text) => {
    try {
        let posts = await Post.find({
            $or: [
                { title: new RegExp(text, "i") },
                { content: new RegExp(text, "i") }
            ],
        })
        return posts
    } catch (error) {
        throw error
    }
}

// //Get blogPost from date A to date B
// //VD1: http://127.0.0.1:3000/blogposts/queryBlogPostsByDateRange?from=01-11-2018&to=05-11-2018
const searchByDateRange = async (from, to) => {
    //format: dd-mm-yyyy    
    let fromDate = new Date(parseInt(from.split('-')[2]),
        parseInt(from.split('-')[1]) - 1,
        parseInt(from.split('-')[0]))
    let toDate = new Date(parseInt(to.split('-')[2]),
        parseInt(to.split('-')[1]) - 1,
        parseInt(to.split('-')[0]) + 1)
    try {
        let posts = await Post.find({
            date: { $gte: fromDate, $lte: toDate },
        })
        return posts
    } catch (error) {
        throw error
    }
}

const getDetailById = async (id) => {
    try {
        let post = await Post.findById(id)
        if (!post) throw `Can not find post with Id=${id}`
        return post
    } catch (error) {
        throw error
    }
}
// //Only author can be update author's blog
const update = async (id, updatedPost, tokenKey) => {
    try {
        let signedInUser = await authController.verifyJWT(tokenKey)
        let { title, content, description, tags } = updatedPost

        let query = {
            ...(title && { title }),
            ...(content && { content }),
            ...(description && { description }),
            ...(tags && { tags }),
            date: Date.now()
        }
        let post = await Post.findOneAndUpdate({ _id: id, author: signedInUser.id }, query, { new: true })
        if (!post) {
            throw `You can not update post because you are not an author or wrong category ID`
        }
        return post
    } catch (error) {
        throw error
    }
}

const deleteById = async (id, tokenKey) => {
    try {
        let signedInUser = await authController.verifyJWT(tokenKey)
        let post = await Post.findById(id)
        if (!post) {
            throw `Can not find blogPost with Id = ${id}`
        }
        if (signedInUser.id !== post.author.toString()) {
            throw "Can not delete record because you are not author"
        }
        let commentIds = post.comments
        Promise.all([
            Comment.deleteMany({ _id: { $in: commentIds } }),
            User.updateMany(
                { comments: { $in: commentIds } },
                { $pull: { comments: { $in: commentIds } } }
            ),
            User.updateMany(
                { posts: id },
                { $pull: { posts: id } }
            ),
            Post.deleteOne({ _id: id })
        ])
    } catch (error) {
        throw error
    }
}

module.exports = {
    add,
    search,
    searchByDateRange,
    getDetailById,
    update,
    deleteById
}