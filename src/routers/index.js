const authMiddleware = require('../middlewares/auth.middleware')

const routers = require('express').Router()

routers.get('/', (req, res) => {
  res.send('API is running!')
})

routers.use('', require('./auth.router'))
routers.use('/users', authMiddleware, require('./users.router'))

module.exports = routers