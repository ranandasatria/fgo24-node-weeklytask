'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MovieGenre extends Model {
    static associate(models) {
    }
  }

  MovieGenre.init({
    id_movie: DataTypes.INTEGER,
    id_genre: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MovieGenre',
  });

  return MovieGenre;
};
