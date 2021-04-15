const express = require('express')
const router = express.Router()

const passport = require('../config/passport')
const helpers = require('../_helpers')

const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const categoryController = require('../controllers/categoryController.js')
const commentController = require('../controllers/commentController.js')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// 身份驗證
// 使用者
const authenticated = (req, res, next) => {
  // if (req.isAuthenticated()) orignial
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}
// 管理員
const authenticatedAdmin = (req, res, next) => {
  // if (req.isAuthenticated()) original
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) {
      return next()
    }
    return res.redirect('/')
  }
  res.redirect('/signin')
}

// 前台入口
// 如果使用者訪問首頁，就導向 /restaurants 的頁面
router.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
// 在 /restaurants 底下則交給 restController.getRestaurants 來處理
router.get('/restaurants', authenticated, restController.getRestaurants)
// 最新動態 feeds
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
// top 10 restaurants
router.get('/restaurants/top', authenticated, restController.getTopRestaurants)
// 前台餐廳個別資料
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
// 餐廳資訊總整理
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)

// 新增評論
router.post('/comments', authenticated, commentController.postComment)
// 刪除評論
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

// 美食達人頁面
router.get('/users/top', authenticated, userController.getTopUser)
// 瀏覽 Profile 頁面
router.get('/users/:id', authenticated, userController.getUser)
// 編輯 Profile 頁面
router.get('/users/:id/edit', authenticated, userController.editUser)
// 編輯 Profile 功能
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

// 加入最愛
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
// 刪除最愛
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

// Like 餐廳
router.post('/like/:restaurantId', authenticated, userController.addLike)
// Unlike 餐廳
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

// 追蹤 User
router.post('/following/:userId', authenticated, userController.addFollowing)
// 刪除已追蹤 User
router.delete('/following/:userId', authenticated, userController.removeFollowing)


// 後台入口
// 連到 /admin 頁面就轉到 /admin/restaurants
router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
// 餐廳總表
router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
// 新增餐廳頁面
router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
// 新增餐廳功能
router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
// 瀏覽一筆餐廳資料
router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
// 編輯餐廳頁面
router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
// 編輯一筆餐廳資料
router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
// 刪除一筆餐廳資料
router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

// 使用者權限管理頁面
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
// 使用者權限更新
router.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)

// 後台所有分類總表
router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
// 新增分類
router.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
// 編輯分類頁面
router.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
// 編輯分類
router.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
// 刪除分類
router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)


// 註冊路由
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// 登入登出路由
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

module.exports = router