const { constants: http} = require('http2');
const { Users } = require('../models')

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

