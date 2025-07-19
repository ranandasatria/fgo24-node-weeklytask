'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionDetail extends Model {
    static associate(models) {
      TransactionDetail.belongsTo(models.Transaction, {
        foreignKey: 'transactionId',
        as: 'transaction'
      });
    }
  }
  TransactionDetail.init({
    transactionId: DataTypes.INTEGER,
    seat: DataTypes.STRING,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TransactionDetail',
    tableName: 'Transaction_Details',
    underscored: true,
    timestamps: true
  });
  return TransactionDetail;
};
