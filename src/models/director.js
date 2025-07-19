'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Director extends Model {
    static associate(models) {
      Director.belongsToMany(models.Movie, {
        through: models.MovieDirector,
        foreignKey: 'id_director',
        otherKey: 'id_movie'
      });
    }
  }

  Director.init({
    director_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Director',
  });

  return Director;
};
