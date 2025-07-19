const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genre.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', genreController.getAllGenres);

router.post('/', authMiddleware, genreController.createGenre);

module.exports = router;
