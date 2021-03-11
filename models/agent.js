'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Agent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Agent.hasMany(models.Player, {
        foreignKey: 'agent_id',
        as: 'players'
      });

      Agent.hasMany(models.Agent, {
        foreignKey: 'parent_id',
        as: 'agent_masters',
        sourceKey: 'parent_id',
        useJunctionTable: false
      });

      Agent.belongsTo(models.Agent, {
        foreignKey: 'parent_id',
        as: 'agent_agent',
        sourceKey: 'parent_id',
        useJunctionTable: false
      });
    }
  };
  Agent.init({
    parent_id: DataTypes.INTEGER,
    agent_code: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    api_key: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    norek: DataTypes.STRING,
    bank_name: DataTypes.STRING,
    role: DataTypes.ENUM('master', 'agent')
  }, {
    sequelize,
    modelName: 'Agent',
  });
  return Agent;
};