const initListeners = require('../game/listeners');

// connect our initialize listeners
module.exports = io => {
  io.on('connection', socket => initListeners(io, socket));
};

// dispatch actions from server reducer in this folder
