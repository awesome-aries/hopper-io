const initServerListeners = require('./listeners');

// connect our initialize listeners
module.exports = io => {
  io.on('connection', socket => initServerListeners(io, socket));
};

// dispatch actions from server reducer in this folder
