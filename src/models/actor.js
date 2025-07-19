'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Actor extends Model {
    static associate(models) {
      Actor.belongsToMany(models.Movie, {
        through: models.MovieCast,
        foreignKey: 'id_actor',
        otherKey: 'id_movie'
      });
    }
  }

  Actor.init({
    actor_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Actor',
  });

  return Actor;
};
