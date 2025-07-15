const {constants: http} = require('http2')
const model = require('../models/users.model')

exports.login = function(req, res){
  const {email ,password} = req.body;

  const user = model.getUserByEmail(email)
  
  if(!user || user.password !== password){
    return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
    success: false,
    message: 'Wrong email or password'
  })
  }
  return res.status(http.HTTP_STATUS_FORBIDDEN).json({
    success: true,
    message: 'Login Success'
  })
}