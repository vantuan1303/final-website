const express = require('express')
const router = express.Router()
const productController = require('../controllers/product.controller')

router.post('/add', async (req, res) => {
    let { name, code, description, tags, categories } = req.body
    let tokenKey = req.headers['x-access-token']
    try {
        let newProduct = await productController.add({ name, code, description, tags, categories }, tokenKey)
        res.json({
            result: 'ok',
            message: 'Create new blog successfully!',
            data: newProduct
        })
    } catch (error) {
        res.json({
            result: 'failed',
            message: `Can not create blog. Error : ${error}`
        })
    }
})

router.get('/search', async (req, res) => {
    let { text } = req.query
    try {
        let product = await productController.search(text)
        res.json({
            result: 'ok',
            message: 'Query success list of products',
            data: product
        })
    } catch (error) {
        res.json({
            result: 'failed',
            message: `product not found: ${error}`
        })
    }
})

router.get('/search-by-category', async (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', allowAccessIP)
    let { text } = req.query
    try {
        let products = await productController.searchByCategory(text)
        res.json({
            result: 'ok',
            message: 'Query success list of products',
            data: products
        })
    } catch (error) {
        res.json({
            result: 'failed',
            message: `product not found: ${error}`
        })
    }
})

router.get('/search-by-date-range', async (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', allowAccessIP)
    let { from, to } = req.query
    try {
        let products = await productController.searchByDateRange(from, to)
        res.json({
            result: 'ok',
            message: 'Query success list of products',
            data: products
        })

    } catch (error) {
        res.json({
            result: 'failed',
            message: `product not found: ${error}`
        })
    }
})

router.get('/get-detail-by-id', async (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', allowAccessIP)
    let { id } = req.query
    try {
        let product = await productController.getDetailById(id)
        res.json({
            result: 'ok',
            message: 'Query success list of products',
            data: product
        })
    } catch (error) {
        res.json({
            result: 'failed',
            message: `product not found: ${error}`
        })
    }
})

router.put('/update', async (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', allowAccessIP)
    let { id, name, code, description, tags, categories } = req.body
    let tokenKey = req.headers['x-access-token']
    try {
        let product = await productController.update(id, { name, code, description, tags, categories }, tokenKey)
        res.json({
            result: 'ok',
            message: 'Update product successfully!',
            data: product
        })
    } catch (error) {
        res.json({
            result: 'failed',
            message: `Can not update product: ${error}`
        })
    }
})

router.delete('/delete-by-id/:id', async (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', allowAccessIP)
    let { id } = req.params
    let tokenKey = req.headers['x-access-token']
    try {
        await productController.deleteById(id, tokenKey)
        res.json({
            result: 'ok',
            message: 'Delete product successfully',
        })
    } catch (error) {
        res.json({
            result: 'failed',
            message: `Can not delete product: ${error}`
        })
    }
})

module.exports = router