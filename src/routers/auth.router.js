const authRouter = require('express').Router()
const authController = require('../controllers/auth.controller');
const authDTO = require('../dto/auth.dto')

authRouter.post('/login', authDTO.login ,authController.login)
authRouter.post('/register', authDTO.login, authController.register)
authRouter.post('/forgot-password', authController.forgotPassword)
authRouter.post('/reset-password', authController.resetPassword)

module.exports = authRouter