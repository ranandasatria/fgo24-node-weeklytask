const { Actor } = require('../models');
const { constants: http } = require('http2');

exports.createActor = async (req, res) => {
  try {
    const { actor_name } = req.body;

    if (!actor_name) {
      return res.status(400).json({
        success: false,
        message: 'Actor name is required',
      });
    }

    const actor = await Actor.create({ actor_name });

    return res.status(201).json({
      success: true,
      message: 'Actor created successfully',
      data: actor,
    });
  } catch (error) {
    console.error('Create actor error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


exports.getAllActors = async (req, res) => {
  try {
    const actors = await Actor.findAll();

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: 'Actors retrieved successfully',
      results: actors
    });
  } catch (err) {
    console.error(err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to retrieve actors'
    });
  }
};
