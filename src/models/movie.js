'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    static associate(models) {
      Movie.belongsToMany(models.Genre, {
        through: models.MovieGenre,
        foreignKey: 'id_movie',
        otherKey: 'id_genre'
      });

      Movie.belongsToMany(models.Director, {
        through: models.MovieDirector,
        foreignKey: 'id_movie',
        otherKey: 'id_director'
      });

      Movie.belongsToMany(models.Actor, {
        through: models.MovieCast,
        foreignKey: 'id_movie',
        otherKey: 'id_actor'
      });
    }
  }

  Movie.init({
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  releaseDate: {
    type: DataTypes.DATE,
    field: 'release_date'
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    field: 'duration_minutes'
  },
  image: DataTypes.STRING,
  horizontalImage: {
    type: DataTypes.STRING,
    field: 'horizontal_image'
  }
}, {
  sequelize,
  modelName: 'Movie',
});

  return Movie;
};
