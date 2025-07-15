const {constants: http} = require('http2')

exports.login = function(req, res){
  const {email ,password} = req.body;
  
  if(email === "admin@mail.com" && password === "12345"){
    return res.status(http.HTTP_STATUS_FORBIDDEN).json({
    success: true,
    message: 'Login Success'
  })
  }
  return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
    success: false,
    message: 'Wrong email or password'
  })
}