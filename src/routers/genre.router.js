const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genre.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminCheck = require('../middlewares/admin.middleware');

router.get('/', genreController.getAllGenres);
router.post('/', authMiddleware, adminCheck, genreController.createGenre);

module.exports = router;
