const { Movie, Genre, Director, Actor } = require('../models');
const { constants: http } = require('http2');

exports.createMovie = async (req, res) => {
  const {
    title,
    description,
    release_date,
    duration_minutes,
    image,
    horizontal_image,
    genres,    
    directors,   
    actors      
  } = req.body;

  try {
    const newMovie = await Movie.create({
      title,
      description,
      release_date,
      duration_minutes,
      image,
      horizontal_image
    });

    if (Array.isArray(genres)) {
      await newMovie.setGenres(genres);
    }

    if (Array.isArray(directors)) {
      await newMovie.setDirectors(directors);
    }

    if (Array.isArray(actors)) {
      await newMovie.setActors(actors);
    }

    return res.status(http.HTTP_STATUS_CREATED).json({
      success: true,
      message: 'Movie created successfully',
      results: newMovie
    });
  } catch (err) {
    console.error(err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create movie'
    });
  }
};

exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll({
  include: [
    {
      model: Genre,
      attributes: ['id', 'genre_name'],
      through: { attributes: [] }
    },
    {
      model: Director,
      attributes: ['id', 'director_name'],
      through: { attributes: [] }
    },
    {
      model: Actor,
      attributes: ['id', 'actor_name'],
      through: { attributes: [] }
    }
  ]
  });

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: 'List of movies',
      results: movies
    });
  } catch (err) {
    console.error(err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch movies'
    });
  }
};

exports.getMovieById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const movie = await Movie.findByPk(id, {
      include: [
        {
          model: Genre,
          attributes: ['id', 'genre_name'],
          through: { attributes: [] }
        },
        {
          model: Director,
          attributes: ['id', 'director_name'],
          through: { attributes: [] }
        },
        {
          model: Actor,
          attributes: ['id', 'actor_name'],
          through: { attributes: [] }
        }
      ]
    });

    if (!movie) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: 'Movie not found'
      });
    }

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: 'Movie detail',
      result: movie
    });

  } catch (err) {
    console.error(err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch movie'
    });
  }
};