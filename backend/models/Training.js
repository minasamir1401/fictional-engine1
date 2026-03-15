const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Training = sequelize.define('Training', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.STRING, // Storing as string YYYY-MM-DD for consistency with UI
    allowNull: false
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Training;
