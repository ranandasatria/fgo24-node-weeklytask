const {constants: http} = require('http2')
const { Users } = require("../models");
const { Op } = require("sequelize");

exports.createUser = async function(req, res){ // create a new user (later for admin)
  console.log('req.body:', req.body);
  console.log('req.file:', req.file);
  const {email, password} = req.body;
  const picture = req.file ? req.file.filename : null;
  
    try {
      const existingUser = await Users.findOne({where:{email}})
      if (existingUser){
        return res.status(http.HTTP_STATUS_CONFLICT).json({
          success: false,
          message: 'Email is already registered'
        })
      }

      const newUser = await Users.create({email, password, picture, role: 'user'})
      return res.status(http.HTTP_STATUS_CREATED).json({
      success: true,
      message: "Account created",
      results:  {
        id: newUser.id,
        email: newUser.email,
        picture: newUser.picture
      }
    })
    } catch(err){
      console.error(err)
      return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to create a new user"
      })
    }
}

exports.listAllUsers = async (req, res) => {
  try {
    const { search = "", page = 1 } = req.query;
    const limit = 5;
    const pageNumber = parseInt(page) || 1;
    const offset = (pageNumber - 1) * limit;

    const { count: totalData, rows: users } = await Users.findAndCountAll({
      where: {
        email: {
          [Op.iLike]: `%${search}%`
        }
      },
      attributes: { exclude: ['password'] },
      limit,
      offset
    });

    const totalPage = Math.ceil(totalData / limit);

    return res.json({
      success: true,
      message: search ? `Search results for "${search}":` : "All users:",
      results: users,
      pageInfo: {
        totalData,
        totalPage,
        currentPage: pageNumber,
        limit,
        next: pageNumber < totalPage ? `/users?page=${pageNumber + 1}&search=${search}` : null,
        prev: pageNumber > 1 ? `/users?page=${pageNumber - 1}&search=${search}` : null
      }
    });
  } catch (err) {
    console.error("Error in listAllUsers:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


exports.detailUser = async (req, res) => {
  const id = parseInt(req.params.id);
  try{
    const detailUser = await Users.findByPk(id, {
      attributes: {exclude: 'password'}
    })
    if(!detailUser){
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: 'User not found'
      })
    }

    return res.status(http.HTTP_STATUS_OK).json({
    success: true,
    message: "Detail User",
    results: detailUser
    });
  } catch (err){
    console.error(err)
      return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

exports.deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);
  try{
    const foundUser = await Users.findByPk(id)
    if(!foundUser){
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: 'User not found'
      })
    }
    await foundUser.destroy()

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: 'User deleted',
      results: foundUser
    })
  } catch(err){
    console.error(err)
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete user'
    })
}
}

exports.updateUser = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const foundUser = await Users.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!foundUser) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: 'User not found'
      });
    }

    if (req.body.email) {
      const existingUser = await Users.findOne({
        where: {
          email: req.body.email,
          id: { [Op.ne]: id }
        }
      });

      if (existingUser) {
        return res.status(http.HTTP_STATUS_CONFLICT).json({
          success: false,
          message: 'Email is already used'
        });
      }
    }

    await foundUser.update(req.body);

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: 'User updated',
      results: foundUser
    });
  } catch (err) {
    console.error(err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update user'
    });
  }
};


// with in-memory model:

// exports.createUser = async function(req, res){ // create a new user (later for admin)
//   console.log('req.body:', req.body);
//   console.log('req.file:', req.file);
//   const {email, password} = req.body;
//   const picture = req.file ? req.file.filename : null;
  
    // if(model.getUserByEmail(email)){
    //   return res.status(http.HTTP_STATUS_CONFLICT).json({
    //     success: false,
    //     message: 'Email is already registered'
    //   })
    // }

    //  const newUser = model.createUser({email, password, picture})
    //   return res.status(http.HTTP_STATUS_CREATED).json({
    //   success: true,
    //   message: "Account created",
    //   results:  {
    //     id: newUser.id,
    //     email: newUser.email,
    //     picture: newUser.picture
    //   }
    // })
// }

// exports.listAllUsers = function(req, res){
//   const { search, page= 1} = req.query
//   const limit = 5
//   const pageNumber = parseInt(page) || 1

//   const users = model.getAllUser(search)
//   const totalData = users.length
//   const totalPage = Math.ceil(totalData / limit)
//   const offset = (pageNumber - 1) * limit

//   const paginatedUser = users.slice(offset, offset + limit)

//   const result = paginatedUser.map(u => {
//     const safe = { ...u}
//     delete safe.password
//     return safe
//   })

//   return res.json({
//     success: true,
//     message: search ? `Search results for ${req.query.search}:` : 'All users:',
//     results: result,
//     pageInfo: {
//       totalData,
//       totalPage,
//       currentPage: pageNumber,
//       limit,
//       next: pageNumber < totalPage ? `/users?page=${pageNumber + 1}${search ? `&search=${search}`:''}`
//       : null,
//       prev: pageNumber > 1 ? `/users?page=${pageNumber - 1}${search ? `&search=${search}`:''}`
//       : null
//     }
//   })
// }

// exports.detailUser = function(req, res){
//   const id = parseInt(req.params.id);
//   const detailUser = model.getUserByID(id);

//   if (!detailUser) {
//     return res.status(http.HTTP_STATUS_NOT_FOUND).json({
//       success: false,
//       message: "User not found"
//     });
//   }

//   const safeUser = { ...detailUser}
//   delete safeUser.password

//   return res.status(http.HTTP_STATUS_OK).json({
//     success: true,
//     message: "Detail User",
//     results: safeUser
//   });
// }


// exports.updateUser = function(req, res){
//   const id = parseInt(req.params.id);
//   const updatedUser = model.updateUser(id, req.body)

//   if (!updatedUser){
//     return res.status(http.HTTP_STATUS_NOT_FOUND).json({
//       success: false,
//       message: "User not found"
//     });
//   };

//   const safeUser = {...updatedUser}
//   delete safeUser.password

//   return res.status(http.HTTP_STATUS_OK).json({
//     success: true,
//     message: "Profile updated",
//     results: safeUser
//   });
// }

// exports.deleteUser = function(req, res){
//   const id = parseInt(req.params.id);
//   const deletedUser = model.deleteUser(id)

//   if (!deletedUser){
//     return res.status(http.HTTP_STATUS_NOT_FOUND).json({
//       success: false,
//       message: "User not found"
//     });
//   };

//   return res.status(http.HTTP_STATUS_OK).json({
//     success: true,
//     message: "User deleted",
//     results: deletedUser
//   });
// }