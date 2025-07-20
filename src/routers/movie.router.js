const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminCheck = require('../middlewares/admin.middleware');

const { v4: uuid } = require("uuid");
const path = require("node:path");
const multer = require("multer");

const movieStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("uploads", "movie-images"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuid()}${ext}`;
    cb(null, filename);
  }
});

const uploadMovieImages = multer({ storage: movieStorage });

router.get('/', movieController.getAllMovies)

router.get('/now-showing', movieController.getNowShowingMovies);
router.get('/upcoming', movieController.getUpcomingMovies);
router.get('/:id', movieController.getMovieById);

router.post('/',
  authMiddleware,
  adminCheck,
  uploadMovieImages.fields([
    { name: "image", maxCount: 1 },
    { name: "horizontalImage", maxCount: 1 }
  ]),
  movieController.createMovie
);

router.patch('/:id',
  authMiddleware,
  adminCheck,
  uploadMovieImages.fields([
    { name: "image", maxCount: 1 },
    { name: "horizontalImage", maxCount: 1 }
  ]),
  movieController.updateMovie
);

router.delete('/:id', authMiddleware, adminCheck, movieController.deleteMovie);


module.exports = router;
