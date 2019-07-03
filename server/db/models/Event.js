const Sequelize = require('sequelize');
const db = require('../db');

const Event = db.define('event', {
  harborVolume: {
    type: Sequelize.INTEGER,
    field: 'harbor_volume'
  },
  playerKilled: {
    type: Sequelize.INTEGER,
    field: 'players_killed'
  },
  time: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false
  }
});

module.exports = Event;
