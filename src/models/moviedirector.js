'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MovieDirector extends Model {
    static associate(models) {}
  }

  MovieDirector.init({
    id_movie: DataTypes.INTEGER,
    id_director: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MovieDirector',
  });

  return MovieDirector;
};
