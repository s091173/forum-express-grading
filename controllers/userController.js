const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {

  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) {
            req.flash('error_messages', '信箱重複！')
            return res.redirect('/signup')
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            }).then(user => {
              req.flash('success_messages', '成功註冊帳號！')
              return res.redirect('/signin')
            })
          }
        })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        return res.render('users/profile', { profile: user.toJSON() })
      })
  },

  editUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        return res.render('users/edit', { user: user.toJSON() })
      })
  },

  putUser: (req, res) => {
    // 姓名為必填欄位
    if (!req.body.name) {
      req.flash('error_messages', "name is required")
      return res.redirect('back')
    }

    return User.findByPk(req.params.id)
      .then(user => {
        user.update({
          name: req.body.name
        })
          .then(user => {
            req.flash('success_messages', 'profile was successfully to update')
            res.redirect(`/users/${req.params.id}`)
          })
      })
  }
}

module.exports = userController