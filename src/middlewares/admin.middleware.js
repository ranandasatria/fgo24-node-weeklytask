const { constants: http} = require('http2')

function adminCheck(req, res, next){
  if (req.user?.role !== 'admin'){
    return res.status(http.HTTP_STATUS_FORBIDDEN).json({
      success: false,
      message: 'Access forbidden, admin only'
    })
  }
  next()
}

module.exports = adminCheck