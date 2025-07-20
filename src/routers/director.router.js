const express = require('express');
const router = express.Router();
const directorController = require('../controllers/director.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminCheck = require('../middlewares/admin.middleware');

router.get('/', directorController.getAllDirectors)
router.post('/', authMiddleware,  adminCheck, directorController.createDirector);

module.exports = router;
