const {constants: http} = require('http2')
const model = require('../models/users.model');
const { validationResult } = require('express-validator');


exports.register = function(req, res){
  const {email, password} = req.body;

  if(model.getUserByEmail(email)){
    return res.status(http.HTTP_STATUS_CONFLICT).json({
      success: false,
      message: 'Email is already registered'
    })
  }

  const newUser = model.createUser({email, password})
    return res.status(http.HTTP_STATUS_CREATED).json({
    success: true,
    message: "Account created",
    results:  {
      id: newUser.id,
      email: newUser.email
    }
  })
  }


exports.login = function(req, res){
  const {email ,password} = req.body;

  const validate = validationResult(req);

  if(!validate.isEmpty()){
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "Validation error",
      errors: validate.array(),
    })
  }


  const user = model.getUserByEmail(email)
  
  if(!user || user.password !== password){
    return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
    success: false,
    message: 'Wrong email or password'
  })
  }
  return res.status(http.HTTP_STATUS_OK).json({
    success: true,
    message: 'Login Success'
  })
}