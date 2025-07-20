const { constants: http} = require('http2');
const { Users } = require('../models');
const { Op } = require('sequelize');

exports.getProfile = async (req, res) =>{
  const id = req.user.id
  try{
    const detailUser = await Users.findByPk(id, {
      attributes: {exclude: 'password'}
    })
    if(!detailUser){
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: 'Profile not found'
      })
    }
    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: 'Profile detail',
      results: detailUser
    })

  }catch(err){
    console.error(err)
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update profile'
    })
  }
}

exports.updateProfile = async (req, res) => {
  const id = req.user.id
  try {
    const foundUser = await Users.findByPk(id, {
      attributes: {exclude: 'password'}
    })

    if (!foundUser){
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: 'Profile not found' 
      })
    }

    if (req.body.email){
      const existingUser = await Users.findOne({
        where: {
          email: req.body.email,
          id: { [Op.ne]: id}
        }
      });

      if (existingUser){
        return res.status(http.HTTP_STATUS_CONFLICT).json({
          success: false,
          message: 'Email is already used'
        })
      }
    }

    const updateData = {
      ...req.body,
      picture: req.file?.filename || foundUser.picture
    }

    await foundUser.update(updateData)

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: 'Profile updated',
      results: foundUser
    })
  }catch(err){
    console.error(err)
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update profile'
    })
  }
}