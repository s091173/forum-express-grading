const express = require('express')
const router = express.Router()

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const adminController = require('../controllers/api/adminController.js')
const categoryController = require('../controllers/api/categoryController.js')



// 餐廳總表
router.get('/admin/restaurants', adminController.getRestaurants)
// 瀏覽一筆餐廳資料
router.get('/admin/restaurants/:id', adminController.getRestaurant)
// 新增餐廳功能
router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant)

// 刪除一筆餐廳資料
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)

// 分類總表
router.get('/admin/categories', categoryController.getCategories)

module.exports = router