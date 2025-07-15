const {constants: http} = require('http2')
const model = require("../models/users.model");


exports.createUser = function(req, res){ // create a new user (later for admin)
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
      success: false,
      message: "User not found"
    });
  };

  return res.status(http.HTTP_STATUS_OK).json({
    success: true,
    message: "Profile updated",
    results: updatedUser
  });
}

exports.deleteUser = function(req, res){
  const id = parseInt(req.params.id);
  const deletedUser = model.deleteUser(id)

  if (!deletedUser){
    return res.status(http.HTTP_STATUS_NOT_FOUND).json({
      success: false,
      message: "User not found"
    });
  };

  return res.status(http.HTTP_STATUS_OK).json({
    success: true,
    message: "User deleted",
    results: deletedUser
  });
}