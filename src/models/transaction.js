'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.PaymentMethod, {
        foreignKey: 'paymentMethod'
      });

      Transaction.belongsTo(models.Movie, {
        foreignKey: 'idMovie'
      });

      Transaction.belongsTo(models.Users, {
        foreignKey: 'idUser'
      });

      Transaction.hasMany(models.TransactionDetail, {
        foreignKey: 'transactionId',
        as: 'details'
      });
    }
  }
  Transaction.init({
    idUser: DataTypes.INTEGER,
    idMovie: DataTypes.INTEGER,
    showDate: DataTypes.DATEONLY,
    showTime: DataTypes.TIME,
    location: DataTypes.STRING,
    cinema: DataTypes.STRING,
    totalPrice: DataTypes.INTEGER,
    paymentMethod: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
    tableName: 'Transactions',
    underscored: true,
    timestamps: true
  });
  return Transaction;
};
