const express = require('express')
const router = express.Router()

const adminController = require('../controllers/api/adminController.js')
const categoryController = require('../controllers/api/categoryController.js')



// 餐廳總表
router.get('/admin/restaurants', adminController.getRestaurants)
// 瀏覽一筆餐廳資料
router.get('/admin/restaurants/:id', adminController.getRestaurant)

// 刪除一筆餐廳資料
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)

// 分類總表
router.get('/admin/categories', categoryController.getCategories)

module.exports = router