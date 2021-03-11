'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Players', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      agent_id: {
        references: {
          model: 'agents',
          key: 'id'
        },
        type: Sequelize.INTEGER
      },
      userid: {
        unique: true,
        type: Sequelize.STRING(50)
      },
      displayName: {
        type: Sequelize.STRING(50)
      },
      badge: {
        type: Sequelize.ENUM('gold', 'standart')
      },
      token: {
        type: Sequelize.STRING(255)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Players');
  }
};