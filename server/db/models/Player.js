const Sequelize = require('sequelize');
const db = require('../db');

const Player = db.define('player', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'grace'
  },
  socketId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  x: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  y: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  phaserX: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  phaserY: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  worldX: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  worldY: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  direction: {
    type: Sequelize.STRING,
    defaultValue: 'north'
  },
  isPlaying: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Player;
