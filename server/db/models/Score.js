const Sequelize = require('sequelize');
const db = require('../db');

const Score = db.define('score', {
  harborVolume: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {min: 0}
  },
  harborPercentage: {
    type: Sequelize.DECIMAL,
    allowNull: false,
    validate: {min: 0}
  },
  playersKilled: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {min: 0}
  }
});

module.exports = Score;
