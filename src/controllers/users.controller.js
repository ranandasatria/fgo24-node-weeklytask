const {constants: http} = require('http2')
const model = require("../models/users.model");


exports.createUser = function(req, res){
  const newUser = model.createUser(req.body);
  return res.status(http.HTTP_STATUS_CREATED).json({
    success: true,
    message: "Account created",
    results:  newUser
  })
}

exports.detailUser = function(req, res){
  const id = parseInt(req.params.id);
  const detailUser = model.getUserByID(id);

  if (!detailUser) {
    return res.status(http.HTTP_STATUS_NOT_FOUND).json({
      success: false,
      message: "User not found"
    });
  }

  return res.status(http.HTTP_STATUS_OK).json({
    success: true,
    message: "Detail User",
    results: detailUser
  });
}

exports.listAllUsers = function(req, res){
  const allUser = model.getAllUser()
  return res.json({
    success: true,
    message: 'List all users',
    results: allUser
  })
}

exports.updateUser = function(req, res){
  const id = parseInt(req.params.id);
  const updatedUser = model.updateUser(id, req.body)

  if (!updatedUser){
    return res.status(http.HTTP_STATUS_NOT_FOUND).json({
      status: false,
      message: "User not found"
    });
  };

  return res.status(http.HTTP_STATUS_OK).json({
    status: true,
    message: "Profile updated",
    results: updatedUser
  });
}