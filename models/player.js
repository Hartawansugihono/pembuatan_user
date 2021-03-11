'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Player.belongsTo(models.Agent, {
        foreignKey: 'agent_id',
        as: 'agent'
      });
    }
  };
  Player.init({
    agent_id: DataTypes.INTEGER,
    userid: DataTypes.STRING,
    displayName: DataTypes.STRING,
    badge: DataTypes.ENUM('gold', 'standart'),
    token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Player',
  });
  return Player;
};