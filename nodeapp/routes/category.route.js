const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/category.controller')

router.get('/show-all', async (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', allowAccessIP)
    try {
        let categories = await categoryController.showAll()
        res.json({
            result: 'ok',
            messange: 'Show categories success',
            data: categories
        })
    } catch (error) {
        res.json({
            result: 'failed',
            messange: 'Show categories error ' + error
        })
    }
})

router.get('/search', async (req, res) => {
    let { text } = req.query
    try {
        let categories = await categoryController.searchList(text)
        res.json({
            result: 'ok',
            message: 'Query success list of category',
            data: categories
        })
    } catch (error) {
        res.json({
            result: 'failed',
            message: `Category not found: ${error}`
        })
    }
})

router.post('/create', async (req, res) => {
    let { title, description } = req.body
    let tokenKey = req.headers['x-access-token']
    try {
        let newcategory = await categoryController.create(title, description, tokenKey)
        res.json({
            result: 'ok',
            message: 'Create new category successfully!',
            data: newcategory
        })
    } catch (error) {
        res.json({
            result: 'failed',
            message: `Can not create category. Error : ${error}`
        })
    }
})

router.put('/update', async (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', allowAccessIP)
    let { id, title, description } = req.body
    let tokenKey = req.headers['x-access-token']
    try {
        let category = await categoryController.update(id, { title, description }, tokenKey)
        res.json({
            result: 'ok',
            message: 'Update category successfully!',
            data: category
        })
    } catch (error) {
        res.json({
            result: 'failed',
            message: `Can not update category: ${error}`
        })
    }
})

router.delete('/delete-by-id/:id', async (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', allowAccessIP)
    let { id } = req.params
    let tokenKey = req.headers['x-access-token']
    try {
        await categoryController.deleteById(id, tokenKey)
        res.json({
            result: 'ok',
            message: 'Delete category successfully',
        })
    } catch (error) {
        res.json({
            result: 'failed',
            message: `Can not delete category: ${error}`
        })
    }
})

module.exports = router