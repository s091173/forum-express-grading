// 前台專用 controller
const restController = {
  getRestaurants: (req, res) => {
    return res.render('restaurants')
  }
}
module.exports = restController