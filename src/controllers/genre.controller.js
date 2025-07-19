const { Genre } = require('../models');
const { constants: http } = require('http2');


exports.createGenre = async (req, res) => {
  try {
    const { genre_name } = req.body;

    if (!genre_name) {
      return res.status(400).json({
        success: false,
        message: 'Genre name is required',
      });
    }

    const genre = await Genre.create({ genre_name });

    return res.status(201).json({
      success: true,
      message: 'Genre created successfully',
      data: genre,
    });
  } catch (error) {
    console.error('Create genre error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

exports.getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.findAll();

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: 'Genres retrieved successfully',
      results: genres
    });
  } catch (err) {
    console.error(err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to retrieve genres'
    });
  }
};
