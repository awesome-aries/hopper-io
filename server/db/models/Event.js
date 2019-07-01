const Sequelize = require('sequelize');
const db = require('../_db');

const Event = db.define('event', {
  harborVolume: {
    type: Sequelize.INTEGER,
    field: 'harbor_volume'
  },
  playersKilled: {
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
