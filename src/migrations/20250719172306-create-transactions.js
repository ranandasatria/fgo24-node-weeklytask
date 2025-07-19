'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      id_user: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      id_movie: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Movies',
          key: 'id'
        }
      },
      show_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      show_time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cinema: {
        type: Sequelize.STRING,
        allowNull: false
      },
      total_price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      payment_method: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Payment_Method',
          key: 'id'
        }
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
  }
};
