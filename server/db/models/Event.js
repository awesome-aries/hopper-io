const Sequelize = require('sequelize');
const db = require('../_db');

const Event = db.define('event', {
  harborVolume: {
    type: Sequelize.INTEGER,
    field: 'harborVolume'
  },
  playersKilled: {
    type: Sequelize.INTEGER,
    field: 'players_killed'
  }
});

module.exports = Event;
