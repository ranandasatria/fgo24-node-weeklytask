'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MovieCast extends Model {
    static associate(models) {}
  }

  MovieCast.init({
    id_movie: DataTypes.INTEGER,
    id_actor: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MovieCast',
  });

  return MovieCast;
};
