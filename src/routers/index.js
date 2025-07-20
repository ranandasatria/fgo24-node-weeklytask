const authMiddleware = require('../middlewares/auth.middleware')

const routers = require('express').Router()

routers.get('/', (req, res) => {
  res.send('API is running!')
})

routers.use('', require('./auth.router'))
routers.use('/users', authMiddleware, require('./users.router'))

routers.use('/movies', require('./movie.router'));          
routers.use('/admin/movies', require('./movie.router'));   

routers.use('/genres', require('./genre.router')); 
routers.use('/admin/genres', require('./genre.router'));

routers.use('/directors', require('./director.router'))
routers.use('/admin/directors', require('./director.router'));

routers.use('/actors', require('./actor.router'))
routers.use('/admin/actors', require('./actor.router'));

routers.use('/payment-method', require('./paymentmethod.router'))
routers.use('/admin/payment-method', require('./paymentmethod.router'));

routers.use('/transactions', require('./transaction.router'));
routers.use('', require('./transaction.router'));



module.exports = routers