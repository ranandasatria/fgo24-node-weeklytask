'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PaymentMethod extends Model {
    static associate(models) {
      PaymentMethod.hasMany(models.Transaction, {
        foreignKey: 'paymentMethod'
      });
    }
  }
  PaymentMethod.init({
    paymentName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PaymentMethod',
    tableName: 'Payment_Method',
    underscored: true,
    timestamps: true
  });
  return PaymentMethod;
};
