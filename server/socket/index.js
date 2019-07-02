const initServerListeners = require('./listeners');

// connect our initialize listeners function
module.exports = io => {
  io.on('connection', socket => initServerListeners(io, socket));
};
