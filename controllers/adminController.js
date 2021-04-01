// 後台專用 controller
const adminController = {
  getRestaurants: (req, res) => {
    return res.render('admin/restaurants')
  }
}

module.exports = adminController