const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', movieController.getAllMovies)
router.get('/:id', movieController.getMovieById)

router.post('/', authMiddleware, movieController.createMovie)

module.exports = router;
