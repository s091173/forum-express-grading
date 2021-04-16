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
// 編輯一筆餐廳資料
router.put('/admin/restaurants/:id', upload.single('image'), adminController.putRestaurant)
// 刪除一筆餐廳資料
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)

// 分類總表
router.get('/admin/categories', categoryController.getCategories)
// 新增分類
router.post('/admin/categories', categoryController.postCategory)
// 編輯分類
router.put('/admin/categories/:id', categoryController.putCategory)

module.exports = router