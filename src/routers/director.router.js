const express = require('express');
const router = express.Router();
const directorController = require('../controllers/director.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', directorController.getAllDirectors)

router.post('/', authMiddleware,  directorController.createDirector);

module.exports = router;
