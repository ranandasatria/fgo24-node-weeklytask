'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Genre extends Model {
    static associate(models) {
      Genre.belongsToMany(models.Movie, {
        through: models.MovieGenre,
        foreignKey: 'id_genre',
        otherKey: 'id_movie'
      });
    }
  }

  Genre.init({
    genre_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Genre',
  });

  return Genre;
};
