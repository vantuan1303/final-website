const authController = require('./auth.controller')
const Post = require('../models/post.model')

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
        await newBlogPost.save()
        await signedInUser.posts.push(newBlogPost._id)
        await signedInUser.save()
        return newBlogPost
    } catch (error) {
        throw error
    }
}

const search = async (text) => {
    try {
        let posts = await Post.find({
            $or: [
                {
                    title: new RegExp(text, "i")
                },
                {
                    content: new RegExp(text, "i")
                }
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
        if (!post) {
            throw `Can not find post with Id=${id}`
        }
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
        let post = await Post.findById(id)
        if (!post) {
            throw `Can not find post with Id=${id}`
        }
        if (signedInUser.id !== post.author.toString()) {
            throw "Can not update because you are not post's author"
        }
        post.title = !title ? post.title : title
        post.content = !content ? post.content : content
        post.description = !description ? post.description : description
        post.tags = !tags ? post.tags : tags
        post.date = Date.now()
        await post.save()
        return post
    } catch (error) {
        throw error
    }
}
// //Delete blogPost
// //1. Delete a record in BlogPosts
// //2. Update reference field "blogPosts" in Users
// //=> mảng blogPosts bớt đi 1 phần tử
const deleteById = async (id, tokenKey) => {
    try {
        let signedInUser = await authController.verifyJWT(tokenKey)
        let post = await Post.findById(id)
        if (!post) {
            throw `Can not find blogPost with Id=${id}`
        }
        if (signedInUser.id !== post.author.toString()) {
            throw "Can not delete record because you are not author"
        }
        await Post.deleteOne({ _id: id })
        signedInUser.posts = await signedInUser.posts
            .filter(eachPost => {
                return post._id.toString() !== eachPost._id.toString()
            })
        await signedInUser.save()
    } catch (error) {
        throw error
    }
}

const deleteByAuthor = async (authorId) => {
    try {
        await Post.deleteMany({
            author: authorId
        })
    } catch (error) {
        throw error
    }
}

module.exports = {
    add,
    search,
    // queryByCategory,
    searchByDateRange,
    getDetailById,
    update,
    deleteById,
    deleteByAuthor
}