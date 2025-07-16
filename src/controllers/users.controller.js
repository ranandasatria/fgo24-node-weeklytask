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


// exports.listAllUsers = function(req, res){
//   const users = model.getAllUser(req.query.search);

//   const result = users.map(u => {
//     const safe = { ...u}
//     delete safe.password
//     return safe
//   })

//   return res.json({
//     success: true,
//     message: req.query.search? `Search results for "${req.query.search}` : 'List all users',
//     results: result
//   })
// }

exports.listAllUsers = function(req, res){
  const { search, page= 1} = req.query
  const limit = 5
  const pageNumber = parseInt(page) || 1

  const users = model.getAllUser(search)
  const totalData = users.length
  const totalPage = Math.ceil(totalData / limit)
  const offset = (pageNumber - 1) * limit

  const paginatedUser = users.slice(offset, offset + limit)

  const result = paginatedUser.map(u => {
    const safe = { ...u}
    delete safe.password
    return safe
  })

  return res.json({
    success: true,
    message: search ? `Search results for ${req.query.search}:` : 'All users:',
    results: result,
    pageInfo: {
      totalData,
      totalPage,
      currentPage: pageNumber,
      limit,
      next: pageNumber < totalPage ? `/users?page=${pageNumber + 1}${search ? `&search=${search}`:''}`
      : null,
      prev: pageNumber > 1 ? `/users?page=${pageNumber - 1}${search ? `&search=${search}`:''}`
      : null
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

  const safeUser = { ...detailUser}
  delete safeUser.password

  return res.status(http.HTTP_STATUS_OK).json({
    success: true,
    message: "Detail User",
    results: safeUser
  });
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

  const safeUser = {...updatedUser}
  delete safeUser.password

  return res.status(http.HTTP_STATUS_OK).json({
    success: true,
    message: "Profile updated",
    results: safeUser
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