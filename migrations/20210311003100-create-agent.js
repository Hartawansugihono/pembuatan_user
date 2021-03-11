'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Agents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      parent_id: {
        type: Sequelize.INTEGER
      },
      username: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(35)
      },
      agent_code: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(10)
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      api_key: {
        unique: true,
        type: Sequelize.STRING(255)
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(50)
      },
      phone: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(50)
      },
      norek: {
        allowNull: false,
        type: Sequelize.STRING((30))
      },
      bank_name: {
        allowNull: false,
        type: Sequelize.STRING(35)
      },
      role: {
        allowNull: false,
        type: Sequelize.ENUM('master', 'agent')
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
    await queryInterface.dropTable('Agents');
  }
};