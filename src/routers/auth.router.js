const authRouter = require('express').Router()
const authController = require('../controllers/auth.controller');
const authDTO = require('../dto/auth.dto')

authRouter.post('/login', authDTO.login ,authController.login)
authRouter.post('/register', authController.register)

module.exports = authRouter