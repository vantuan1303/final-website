const express = require('express')
const router = express.Router()
const postController = require('../controllers/post.controller')

router.post('/add', async (req, res) => {
    let {title, content, description, tags} = req.body
    let tokenKey = req.headers['x-access-token']
    try {
        let newPost = await postController.add({title, content, description, tags}, tokenKey)
        res.json({
            result: 'ok',
            message: 'Create new blog successfully!',
            data: newPost
        })
	} catch(error) {
		res.json({
            result: 'failed',
            message: `Can not create blog. Error : ${error}`
        })
	}
})

router.get('/search', async (req, res) => {
    let { text } = req.query
    try {
        let post = await postController.search(text)
        res.json({
            result: 'ok',
            message: 'Query success list of posts',
            data: post
        })
    } catch(error){
        res.json({
            result: 'failed',
            message: `Post not found: ${error}`
        })
    }
})

// router.get('/queryBlogPostsByCategory', async (req, res) => {
//     res.setHeader('Access-Control-Allow-Origin', allowAccessIP)
//     let { category } = req.query
//     try {
//         let blogPost = await queryBlogPostsByCategory(category)
//         res.json({
//             result: 'ok',
//             message: 'Query success list of posts',
//             data: blogPost
//         })
//     } catch(error){
//         res.json({
//             result: 'failed',
//             message: `Post not found: ${error}`
//         })
//     }
// })

router.get('/search-by-date-range', async (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', allowAccessIP)
    let { from, to } = req.query
    try {
        let posts = await postController.searchByDateRange(from, to)
        res.json({
            result: 'ok',
            message: 'Query success list of posts',
            data: posts
        })

    } catch(error){
        res.json({
            result: 'failed',
            message: `Post not found: ${error}`
        })
    }
})

router.get('/get-detail-by-id', async (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', allowAccessIP)
    let { id } = req.query
    try {
        let post = await postController.getDetailById(id)
        res.json({
            result: 'ok',
            message: 'Query success list of posts',
            data: post
        })
    } catch(error){
        res.json({
            result: 'failed',
            message: `Post not found: ${error}`
        })
    }
})

router.put('/update', async (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', allowAccessIP)
    let { id, title, content, description, tags} = req.body
    let tokenKey = req.headers['x-access-token']
    try {
        let post = await postController.update(id, {title, content, description, tags}, tokenKey)
        res.json({
            result: 'ok',
            message: 'Update post successfully!',
            data: post
        })
    } catch(error){
        res.json({
            result: 'failed',
            message: `Can not update post: ${error}`
        })
    }
})

router.delete('/delete-by-id/:id', async (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', allowAccessIP)
    let { id } = req.params
    let tokenKey = req.headers['x-access-token']
    try {
        await postController.deleteById(id, tokenKey)
        res.json({
            result: 'ok',
            message: 'Delete post successfully',
        })
    } catch(error){
        res.json({
            result: 'failed',
            message: `Can not delete post: ${error}`
        })
    }
})

module.exports = router