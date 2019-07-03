const initServerListeners = require('./listeners');
const broadcastState = require('./broadcastState');

module.exports = io => {
  // connect our initialize listeners function so the server listens to events from the clients
  io.on('connection', socket => initServerListeners(io, socket));
  // and start our broadcast so that the server is updating the clients on the new state
  broadcastState(io);
};
