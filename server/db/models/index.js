const User = require('./user');
const Player = require('./Player');
const Event = require('./Event');
const Score = require('./Score');

// Model Associations

Player.hasOne(Score);
Score.belongsTo(Player);

module.exports = {
  User,
  Player,
  Event,
  Score
};
