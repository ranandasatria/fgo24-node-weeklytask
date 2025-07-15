const {constants: http} = require('http2')
const model = require("../models/users.model")

exports.createUser = function(req, res){
  const newUser = model.createUser(req.body);
  return res.status(http.HTTP_STATUS_CREATED).json({
    success: true,
    message: "Account created",
    results:  newUser
  })
}

exports.detailUser = function(req, res){
  const {id} = req.params
  res.status(http.HTTP_STATUS_OK).json({
    success: true,
    message: "Detail User",
    results: {
      id: parseInt(id),
      name: "John"
    }
  })
}

exports.listAllUsers = function(req, res){
  return res.json({
    success: true,
    message: 'List all users'
  })
}