const {constants: http} = require('http2')
const jwt = require('jsonwebtoken')

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
function authMiddleware(req, res, next){
  const authHeader = req.headers.authorization;

  if(!authHeader || !authHeader.startsWith('Bearer ')){
    return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized"
    })
  }

  const token = authHeader.split(" ")[1]
  try {
    const payload = jwt.verify(token, process.env.APP_SECRET);
    req.user = payload
    next()
  } catch (err){
    return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
      success: false,
      message: 'Invalid token',
      error: err
    })
  }

}

module.exports = authMiddleware;