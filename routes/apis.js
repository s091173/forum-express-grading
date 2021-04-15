const express = require('express')
const router = express.Router()

const adminController = require('../controllers/api/adminController.js')

// 餐廳總表
router.get('/admin/restaurants', adminController.getRestaurants)
// 瀏覽一筆餐廳資料
router.get('/admin/restaurants/:id', adminController.getRestaurant)

module.exports = router