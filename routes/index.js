const helpers = require('../_helpers')

const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const categoryController = require('../controllers/categoryController.js')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

module.exports = (app, passport) => {

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
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
  // 在 /restaurants 底下則交給 restController.getRestaurants 來處理
  app.get('/restaurants', authenticated, restController.getRestaurants)

  // 後台入口
  // 連到 /admin 頁面就轉到 /admin/restaurants
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
  // 餐廳總表
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
  // 新增餐廳頁面
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  // 新增餐廳功能
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
  // 瀏覽一筆餐廳資料
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
  // 編輯餐廳頁面
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
  // 編輯一筆餐廳資料
  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
  // 刪除一筆餐廳資料
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

  // 使用者權限管理頁面
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  // 使用者權限更新
  app.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)

  // 後台所有分類總表
  app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
  // 新增分類
  app.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
  // 編輯分類頁面
  app.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
  // 編輯分類
  app.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
  // 刪除分類
  app.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)


  // 註冊路由
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  // 登入登出路由
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)
}