const {constants: http} = require('http2')

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
function authMiddleware(req, res, next){
  const authHeader = req.headers.authorization;

  if(!authHeader){
    return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized"
    })
  }
  next();
}

module.exports = authMiddleware;