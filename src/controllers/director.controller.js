const { Director } = require('../models');
const { constants: http } = require('http2');


exports.createDirector = async (req, res) => {
  try {
    const { director_name } = req.body;

    if (!director_name) {
      return res.status(400).json({
        success: false,
        message: 'Director name is required',
      });
    }

    const director = await Director.create({ director_name });

    return res.status(201).json({
      success: true,
      message: 'Director created successfully',
      data: director,
    });
  } catch (error) {
    console.error('Create director error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

exports.getAllDirectors = async (req, res) => {
  try {
    const directors = await Director.findAll();

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: 'Directors retrieved successfully',
      results: directors
    });
  } catch (err) {
    console.error(err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to retrieve directors'
    });
  }
};
