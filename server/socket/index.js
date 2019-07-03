const initServerListeners = require('./listeners');

module.exports = io => {
  // connect our initialize listeners function so the server listens to events from the clients
  io.on('connection', socket => initServerListeners(io, socket));
};
