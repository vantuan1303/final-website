const express = require('express')
const router = express.Router()
const commentController = require('../controllers/comment.controller')

router.post('/add-on-post', async (req, res) => {
    let { title, rate, content, postId} = req.body
    let tokenKey = req.headers['x-access-token']
    try {
        let newComment = await commentController.addOnPost({ title, rate, content }, postId, tokenKey)
        res.json({
            result: 'ok',
            message: 'Create new comment successfully!',
            data: newComment
        })
    } catch (error) {
        res.json({
            result: 'failed',
            message: `Can not create comment. Error : ${error}`
        })
    }
})

router.post('/add-on-product', async (req, res) => {
    let { title, rate, content, productId} = req.body
    let tokenKey = req.headers['x-access-token']
    try {
        let newComment = await commentController.addOnProduct({ title, rate, content }, productId, tokenKey)
        res.json({
            result: 'ok',
            message: 'Create new comment successfully!',
            data: newComment
        })
    } catch (error) {
        res.json({
            result: 'failed',
            message: `Can not create comment. Error : ${error}`
        })
    }
})

// router.get('/search', async (req, res) => {
//     let { text } = req.query
//     try {
//         let comment = await commentController.search(text)
//         res.json({
//             result: 'ok',
//             message: 'Query success list of comments',
//             data: comment
//         })
//     } catch (error) {
//         res.json({
//             result: 'failed',
//             message: `comment not found: ${error}`
//         })
//     }
// })

// router.get('/search-by-category', async (req, res) => {
//     // res.setHeader('Access-Control-Allow-Origin', allowAccessIP)
//     let { text } = req.query
//     try {
//         let comments = await commentController.searchByCategory(text)
//         res.json({
//             result: 'ok',
//             message: 'Query success list of comments',
//             data: comments
//         })
//     } catch (error) {
//         res.json({
//             result: 'failed',
//             message: `comment not found: ${error}`
//         })
//     }
// })

// router.get('/search-by-date-range', async (req, res) => {
//     // res.setHeader('Access-Control-Allow-Origin', allowAccessIP)
//     let { from, to } = req.query
//     try {
//         let comments = await commentController.searchByDateRange(from, to)
//         res.json({
//             result: 'ok',
//             message: 'Query success list of comments',
//             data: comments
//         })

//     } catch (error) {
//         res.json({
//             result: 'failed',
//             message: `comment not found: ${error}`
//         })
//     }
// })

// router.get('/get-detail-by-id', async (req, res) => {
//     // res.setHeader('Access-Control-Allow-Origin', allowAccessIP)
//     let { id } = req.query
//     try {
//         let comment = await commentController.getDetailById(id)
//         res.json({
//             result: 'ok',
//             message: 'Query success list of comments',
//             data: comment
//         })
//     } catch (error) {
//         res.json({
//             result: 'failed',
//             message: `comment not found: ${error}`
//         })
//     }
// })

// router.put('/update', async (req, res) => {
//     // res.setHeader('Access-Control-Allow-Origin', allowAccessIP)
//     let { id, name, code, description, tags, categories } = req.body
//     let tokenKey = req.headers['x-access-token']
//     try {
//         let comment = await commentController.update(id, { name, code, description, tags, categories }, tokenKey)
//         res.json({
//             result: 'ok',
//             message: 'Update comment successfully!',
//             data: comment
//         })
//     } catch (error) {
//         res.json({
//             result: 'failed',
//             message: `Can not update comment: ${error}`
//         })
//     }
// })

// router.delete('/delete-by-id/:id', async (req, res) => {
//     // res.setHeader('Access-Control-Allow-Origin', allowAccessIP)
//     let { id } = req.params
//     let tokenKey = req.headers['x-access-token']
//     try {
//         await commentController.deleteById(id, tokenKey)
//         res.json({
//             result: 'ok',
//             message: 'Delete comment successfully',
//         })
//     } catch (error) {
//         res.json({
//             result: 'failed',
//             message: `Can not delete comment: ${error}`
//         })
//     }
// })

module.exports = router