const { Movie, Genre, Director, Actor } = require('../models');
const { constants: http } = require('http2');
const { Op } = require('sequelize');
const redis = require('../services/redis.service');
const clearMovieCache = require('../utils/clearMovieCache')

exports.createMovie = async (req, res) => {
  const {
    title,
    description,
    releaseDate,
    durationMinutes,
    genres,
    directors,
    actors
  } = req.body;

  const files = req.files;
  const image = files?.image?.[0]?.filename || null;
  const horizontalImage = files?.horizontalImage?.[0]?.filename || null;

  try {
    const newMovie = await Movie.create({
      title,
      description,
      releaseDate,
      durationMinutes,
      image,
      horizontalImage
    });

    if (genres) {
      const parsedGenres = typeof genres === 'string' ? JSON.parse(genres) : genres;
      await newMovie.setGenres(parsedGenres);
    }

    if (directors) {
      const parsedDirectors = typeof directors === 'string' ? JSON.parse(directors) : directors;
      await newMovie.setDirectors(parsedDirectors);
    }

    if (actors) {
      const parsedActors = typeof actors === 'string' ? JSON.parse(actors) : actors;
      await newMovie.setActors(parsedActors);
    }

    const createdMovie = await Movie.findByPk(newMovie.id, {
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

    const {
      Genres, Directors, Actors,
      ...movieData
    } = createdMovie.toJSON();

    const formattedMovie = {
      ...movieData,
      genres: Genres,
      directors: Directors,
      actors: Actors
    };
    await clearMovieCache();
    return res.status(http.HTTP_STATUS_CREATED).json({
      success: true,
      message: 'Movie created successfully',
      results: formattedMovie
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
    const { search = "", page = 1 } = req.query;
    const limit = 5;
    const pageNumber = parseInt(page) || 1;
    const offset = (pageNumber - 1) * limit;

    const redisKey = `movies:search=${search}:page=${pageNumber}`;

    const cachedData = await redis.get(redisKey);
    if (cachedData) {
      return res.status(http.HTTP_STATUS_OK).json(JSON.parse(cachedData));
    }

    const { count: totalData, rows: movies } = await Movie.findAndCountAll({
      where: {
        title: {
          [Op.iLike]: `%${search}%`
        }
      },
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
      ],
      limit,
      offset
    });

    const totalPage = Math.ceil(totalData / limit);

    const formattedMovies = movies.map(movie => {
      const { Genres, Directors, Actors, ...movieData } = movie.toJSON();
      return {
        ...movieData,
        genres: Genres,
        directors: Directors,
        actors: Actors
      };
    });

    const response = {
      success: true,
      message: search ? `Search results for "${search}":` : "List of movies",
      results: formattedMovies,
      pageInfo: {
        totalData,
        totalPage,
        currentPage: pageNumber,
        limit,
        next: pageNumber < totalPage ? `/movies?page=${pageNumber + 1}&search=${search}` : null,
        prev: pageNumber > 1 ? `/movies?page=${pageNumber - 1}&search=${search}` : null
      }
    };

    await redis.set(redisKey, JSON.stringify(response));
    return res.status(http.HTTP_STATUS_OK).json(response);

  } catch (err) {
    console.error("Error in getAllMovies:", err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch movies'
    });
  }
};

exports.getMovieById = async (req, res) => {
  const id = parseInt(req.params.id);
  const redisKey = `movie:${id}`;

  try {
    const cached = await redis.get(redisKey);
    if (cached) {
      return res.status(http.HTTP_STATUS_OK).json(JSON.parse(cached));
    }

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

    const { Genres, Directors, Actors, ...movieData } = movie.toJSON();
    const formattedMovie = {
      ...movieData,
      genres: Genres,
      directors: Directors,
      actors: Actors
    };

    const response = {
      success: true,
      message: 'Movie detail',
      result: formattedMovie
    };

    await redis.set(redisKey, JSON.stringify(response));
    return res.status(http.HTTP_STATUS_OK).json(response);

  } catch (err) {
    console.error(err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch movie'
    });
  }
};

exports.deleteMovie = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const movie = await Movie.findByPk(id);
    if (!movie) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: 'Movie not found'
      });
    }

    await movie.setGenres([]);
    await movie.setDirectors([]);
    await movie.setActors([]);
    await movie.destroy();
    await clearMovieCache();

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (err) {
    console.error(err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete movie'
    });
  }
};

exports.updateMovie = async (req, res) => {
  const id = req.params.id;
  const {
    title,
    description,
    releaseDate,
    durationMinutes,
    genres,
    directors,
    actors
  } = req.body;

  const files = req.files;
  const image = files?.image?.[0]?.filename || null;
  const horizontalImage = files?.horizontalImage?.[0]?.filename || null;

  try {
    const movie = await Movie.findByPk(id);
    if (!movie) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({ 
        success: false, 
        message: 'Movie not found' 
      });
    }

    await movie.update({
      title: title ?? movie.title,
      description: description ?? movie.description,
      releaseDate: releaseDate ?? movie.releaseDate,
      durationMinutes: durationMinutes ?? movie.durationMinutes,
      image: image ?? movie.image,
      horizontalImage: horizontalImage ?? movie.horizontalImage
    });

    if (genres) {
      const parsedGenres = typeof genres === 'string' ? JSON.parse(genres) : genres;
      await movie.setGenres(parsedGenres);
    }

    if (directors) {
      const parsedDirectors = typeof directors === 'string' ? JSON.parse(directors) : directors;
      await movie.setDirectors(parsedDirectors);
    }

    if (actors) {
      const parsedActors = typeof actors === 'string' ? JSON.parse(actors) : actors;
      await movie.setActors(parsedActors);
    }

    const updatedMovie = await Movie.findByPk(id, {
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

    const {
      Genres,
      Directors,
      Actors,
      ...movieData
    } = updatedMovie.toJSON();

    const formattedMovie = {
      ...movieData,
      genres: Genres,
      directors: Directors,
      actors: Actors
    };
    await clearMovieCache();
    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: 'Movie updated successfully',
      results: formattedMovie
    });

  } catch (err) {
    console.error(err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Failed to update movie' 
    });
  }
};

exports.getNowShowingMovies = async (req, res) => {
  try {
    const today = new Date();

    const movies = await Movie.findAll({
      where: {
        releaseDate: {
          [Op.lte]: today
        }
      },
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
      ],
      order: [['releaseDate', 'DESC']]
    });

    const formattedMovies = movies.map((movie) => {
      const { Genres, Directors, Actors, ...movieData } = movie.toJSON();
      return {
        ...movieData,
        genres: Genres,
        directors: Directors,
        actors: Actors
      };
    });

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: 'Now showing movies',
      results: formattedMovies
    });
  } catch (err) {
    console.error(err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch now showing movies'
    });
  }
};

exports.getUpcomingMovies = async (req, res) => {
  try {
    const today = new Date();

    const movies = await Movie.findAll({
      where: {
        releaseDate: {
          [Op.gt]: today
        }
      },
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
      ],
      order: [['releaseDate', 'ASC']]
    });

    const formattedMovies = movies.map((movie) => {
      const { Genres, Directors, Actors, ...movieData } = movie.toJSON();
      return {
        ...movieData,
        genres: Genres,
        directors: Directors,
        actors: Actors
      };
    });

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: 'Upcoming movies',
      results: formattedMovies
    });
  } catch (err) {
    console.error(err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch upcoming movies'
    });
  }
};
